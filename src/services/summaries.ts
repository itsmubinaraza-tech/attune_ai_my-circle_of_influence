import { supabase } from '@/lib/supabase';
import type { Person, Interaction } from '@/types/database';

export interface RelationshipSummary {
  personId: string;
  personName: string;
  group: string;
  healthScore: number;
  healthTrend: 'improving' | 'stable' | 'declining';
  lastContact: string | null;
  daysSinceContact: number | null;
  totalInteractions: number;
  recentInteractions: number; // Last 30 days
  successRate: number; // Percentage of successful interactions
  topInteractionType: string | null;
  moodPattern: string | null;
  strengths: string[];
  areasToImprove: string[];
  suggestedActions: string[];
}

export interface CircleInsights {
  totalPeople: number;
  totalInteractions: number;
  averageHealth: number;
  healthDistribution: {
    healthy: number; // 70-100
    moderate: number; // 40-69
    needsAttention: number; // 0-39
  };
  groupBreakdown: Record<string, number>;
  mostConnected: { name: string; interactions: number }[];
  needsAttention: { name: string; daysSinceContact: number }[];
  recentActivity: { date: string; count: number }[];
  weeklyTrend: 'up' | 'stable' | 'down';
}

// Get relationship summary for a person
export async function getRelationshipSummary(personId: string): Promise<RelationshipSummary | null> {
  // Get person data
  const { data: person, error: personError } = await supabase
    .from('people')
    .select('*')
    .eq('id', personId)
    .single();

  if (personError || !person) return null;

  // Get all interactions for this person
  const { data: interactions = [] } = await supabase
    .from('interactions')
    .select('*')
    .eq('person_id', personId)
    .order('interaction_date', { ascending: false });

  // Calculate days since last contact
  const daysSinceContact = person.last_contact
    ? Math.floor((Date.now() - new Date(person.last_contact).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate recent interactions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentInteractions = interactions.filter(
    i => new Date(i.interaction_date) >= thirtyDaysAgo
  ).length;

  // Calculate success rate
  const interactionsWithOutcome = interactions.filter(i => i.outcome);
  const successfulInteractions = interactionsWithOutcome.filter(i => i.outcome === 'successful').length;
  const successRate = interactionsWithOutcome.length > 0
    ? Math.round((successfulInteractions / interactionsWithOutcome.length) * 100)
    : 0;

  // Find top interaction type
  const typeCounts: Record<string, number> = {};
  interactions.forEach(i => {
    if (i.context) {
      const match = i.context.match(/^\[(\w+)\]/);
      if (match) {
        typeCounts[match[1]] = (typeCounts[match[1]] || 0) + 1;
      }
    }
  });
  const topInteractionType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Analyze mood patterns
  const moodAfters = interactions.map(i => i.mood_after).filter(Boolean);
  const moodPattern = analyzeMoodPattern(moodAfters as string[]);

  // Determine health trend based on recent interactions
  const healthTrend = determineHealthTrend(interactions, person.relationship_health);

  // Generate insights
  const { strengths, areasToImprove, suggestedActions } = generateInsights(
    person,
    interactions,
    daysSinceContact,
    successRate,
    healthTrend
  );

  return {
    personId: person.id,
    personName: person.name,
    group: person.group,
    healthScore: person.relationship_health ?? 50,
    healthTrend,
    lastContact: person.last_contact,
    daysSinceContact,
    totalInteractions: interactions.length,
    recentInteractions,
    successRate,
    topInteractionType,
    moodPattern,
    strengths,
    areasToImprove,
    suggestedActions,
  };
}

// Get insights for entire circle
export async function getCircleInsights(): Promise<CircleInsights> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get all people
  const { data: people = [] } = await supabase
    .from('people')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false);

  // Get all interactions
  const { data: interactions = [] } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', user.id)
    .order('interaction_date', { ascending: false });

  // Calculate average health
  const healthScores = people.map(p => p.relationship_health ?? 50);
  const averageHealth = healthScores.length > 0
    ? Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length)
    : 50;

  // Health distribution
  const healthDistribution = {
    healthy: people.filter(p => (p.relationship_health ?? 50) >= 70).length,
    moderate: people.filter(p => {
      const h = p.relationship_health ?? 50;
      return h >= 40 && h < 70;
    }).length,
    needsAttention: people.filter(p => (p.relationship_health ?? 50) < 40).length,
  };

  // Group breakdown
  const groupBreakdown: Record<string, number> = {};
  people.forEach(p => {
    groupBreakdown[p.group] = (groupBreakdown[p.group] || 0) + 1;
  });

  // Most connected (by interaction count)
  const interactionCounts: Record<string, { name: string; count: number }> = {};
  interactions.forEach(i => {
    const person = people.find(p => p.id === i.person_id);
    if (person) {
      if (!interactionCounts[person.id]) {
        interactionCounts[person.id] = { name: person.name, count: 0 };
      }
      interactionCounts[person.id].count++;
    }
  });
  const mostConnected = Object.values(interactionCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(({ name, count }) => ({ name, interactions: count }));

  // Needs attention (longest time since contact)
  const needsAttention = people
    .map(p => ({
      name: p.name,
      daysSinceContact: p.last_contact
        ? Math.floor((Date.now() - new Date(p.last_contact).getTime()) / (1000 * 60 * 60 * 24))
        : 999,
    }))
    .filter(p => p.daysSinceContact > 14) // More than 2 weeks
    .sort((a, b) => b.daysSinceContact - a.daysSinceContact)
    .slice(0, 5);

  // Recent activity (last 7 days)
  const recentActivity: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = interactions.filter(int =>
      int.interaction_date.startsWith(dateStr)
    ).length;
    recentActivity.push({ date: dateStr, count });
  }

  // Weekly trend
  const thisWeekCount = recentActivity.slice(-7).reduce((a, b) => a + b.count, 0);
  const lastWeekInteractions = interactions.filter(i => {
    const date = new Date(i.interaction_date);
    const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo >= 7 && daysAgo < 14;
  }).length;

  let weeklyTrend: 'up' | 'stable' | 'down' = 'stable';
  if (thisWeekCount > lastWeekInteractions * 1.2) weeklyTrend = 'up';
  else if (thisWeekCount < lastWeekInteractions * 0.8) weeklyTrend = 'down';

  return {
    totalPeople: people.length,
    totalInteractions: interactions.length,
    averageHealth,
    healthDistribution,
    groupBreakdown,
    mostConnected,
    needsAttention,
    recentActivity,
    weeklyTrend,
  };
}

// Helper: Analyze mood patterns
function analyzeMoodPattern(moods: string[]): string | null {
  if (moods.length === 0) return null;

  const moodCounts: Record<string, number> = {};
  moods.forEach(m => {
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  });

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  if (!dominantMood) return null;

  const percentage = Math.round((dominantMood[1] / moods.length) * 100);

  if (percentage >= 60) {
    return `Usually feel ${dominantMood[0]} after interactions`;
  }

  return 'Mixed emotional responses';
}

// Helper: Determine health trend
function determineHealthTrend(
  interactions: Interaction[],
  currentHealth: number | null
): 'improving' | 'stable' | 'declining' {
  if (interactions.length < 3) return 'stable';

  // Look at last 5 interactions
  const recent = interactions.slice(0, 5);
  const successCount = recent.filter(i => i.outcome === 'successful').length;
  const unsuccessfulCount = recent.filter(i => i.outcome === 'unsuccessful').length;

  if (successCount >= 3) return 'improving';
  if (unsuccessfulCount >= 2) return 'declining';

  // Check if interactions are happening regularly
  const daysSinceLatest = interactions[0]
    ? Math.floor((Date.now() - new Date(interactions[0].interaction_date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (daysSinceLatest > 30) return 'declining';

  return 'stable';
}

// Helper: Generate insights
function generateInsights(
  person: Person,
  interactions: Interaction[],
  daysSinceContact: number | null,
  successRate: number,
  healthTrend: 'improving' | 'stable' | 'declining'
): {
  strengths: string[];
  areasToImprove: string[];
  suggestedActions: string[];
} {
  const strengths: string[] = [];
  const areasToImprove: string[] = [];
  const suggestedActions: string[] = [];

  // Analyze strengths
  if (successRate >= 70) {
    strengths.push('High success rate in interactions');
  }
  if (interactions.length >= 10) {
    strengths.push('Consistent engagement history');
  }
  if (healthTrend === 'improving') {
    strengths.push('Relationship is growing stronger');
  }
  if (person.notes && person.notes.length > 50) {
    strengths.push('Good documentation of relationship');
  }

  // Analyze areas to improve
  if (daysSinceContact && daysSinceContact > 30) {
    areasToImprove.push('Long time since last contact');
  }
  if (successRate < 50 && interactions.length > 3) {
    areasToImprove.push('Low success rate in recent interactions');
  }
  if (interactions.length < 3) {
    areasToImprove.push('Limited interaction history');
  }
  if (healthTrend === 'declining') {
    areasToImprove.push('Relationship health is declining');
  }

  // Generate suggested actions
  if (daysSinceContact === null || daysSinceContact > 14) {
    suggestedActions.push('Schedule a catch-up call or meeting');
  }
  if (successRate < 60 && interactions.length > 0) {
    suggestedActions.push('Review what worked well in past interactions');
  }
  if (!person.notes) {
    suggestedActions.push('Add notes about communication preferences');
  }
  if (person.group === 'work' && !person.role) {
    suggestedActions.push('Update their role/title information');
  }
  if (interactions.length === 0) {
    suggestedActions.push('Log your first interaction to start tracking');
  }

  // Add group-specific suggestions
  switch (person.group) {
    case 'family':
      if (daysSinceContact && daysSinceContact > 7) {
        suggestedActions.push('Family connections benefit from regular check-ins');
      }
      break;
    case 'work':
      if (healthTrend === 'declining') {
        suggestedActions.push('Consider a professional coffee chat');
      }
      break;
    case 'friends':
      if (daysSinceContact && daysSinceContact > 21) {
        suggestedActions.push('Plan a social activity together');
      }
      break;
  }

  // Limit to top 3 each
  return {
    strengths: strengths.slice(0, 3),
    areasToImprove: areasToImprove.slice(0, 3),
    suggestedActions: suggestedActions.slice(0, 3),
  };
}

// Generate AI-powered summary using Claude (via edge function)
export async function generateAISummary(personId: string): Promise<string> {
  const summary = await getRelationshipSummary(personId);
  if (!summary) throw new Error('Person not found');

  // Get recent interactions for context
  const { data: interactions = [] } = await supabase
    .from('interactions')
    .select('*')
    .eq('person_id', personId)
    .order('interaction_date', { ascending: false })
    .limit(5);

  // Build context for AI
  const context = {
    name: summary.personName,
    group: summary.group,
    healthScore: summary.healthScore,
    healthTrend: summary.healthTrend,
    daysSinceContact: summary.daysSinceContact,
    totalInteractions: summary.totalInteractions,
    successRate: summary.successRate,
    recentInteractions: interactions.map(i => ({
      date: i.interaction_date,
      type: i.context?.match(/^\[(\w+)\]/)?.[1] || 'unknown',
      outcome: i.outcome,
      whatWorked: i.what_worked,
    })),
  };

  // Call edge function for AI summary
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Generate a brief, friendly relationship summary for ${context.name}. Include insights about the relationship health and one actionable suggestion. Keep it to 2-3 sentences. Context: ${JSON.stringify(context)}`,
          },
        ],
        context: {
          type: 'summary',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI summary');
    }

    const data = await response.json();
    return data.content || generateFallbackSummary(summary);
  } catch {
    return generateFallbackSummary(summary);
  }
}

// Fallback summary when AI is unavailable
function generateFallbackSummary(summary: RelationshipSummary): string {
  const parts: string[] = [];

  // Health statement
  if (summary.healthScore >= 70) {
    parts.push(`Your relationship with ${summary.personName} is strong.`);
  } else if (summary.healthScore >= 40) {
    parts.push(`Your relationship with ${summary.personName} is in good standing.`);
  } else {
    parts.push(`Your relationship with ${summary.personName} could use some attention.`);
  }

  // Activity statement
  if (summary.daysSinceContact === null) {
    parts.push(`You haven't logged any interactions yet.`);
  } else if (summary.daysSinceContact === 0) {
    parts.push(`You connected today!`);
  } else if (summary.daysSinceContact <= 7) {
    parts.push(`You last connected ${summary.daysSinceContact} days ago.`);
  } else {
    parts.push(`It's been ${summary.daysSinceContact} days since your last interaction.`);
  }

  // Suggestion
  if (summary.suggestedActions.length > 0) {
    parts.push(summary.suggestedActions[0]);
  }

  return parts.join(' ');
}
