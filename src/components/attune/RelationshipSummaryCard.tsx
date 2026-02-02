import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Calendar,
  MessageSquare,
  Target,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRelationshipSummary, useAISummary } from '@/hooks/useSummaries';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RelationshipSummaryCardProps {
  personId: string;
  personName?: string;
  compact?: boolean;
}

export function RelationshipSummaryCard({
  personId,
  personName,
  compact = false,
}: RelationshipSummaryCardProps) {
  const { data: summary, isLoading, error } = useRelationshipSummary(personId);
  const [showAISummary, setShowAISummary] = useState(false);
  const { data: aiSummary, isLoading: aiLoading } = useAISummary(
    personId,
    showAISummary
  );

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !summary) {
    return null;
  }

  const getTrendIcon = () => {
    switch (summary.healthTrend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getTrendLabel = () => {
    switch (summary.healthTrend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs attention';
      default:
        return 'Stable';
    }
  };

  const getHealthColor = () => {
    if (summary.healthScore >= 70) return 'text-green-400';
    if (summary.healthScore >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = () => {
    if (summary.healthScore >= 70) return 'bg-green-500';
    if (summary.healthScore >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-lg p-3 space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className={cn('h-4 w-4', getHealthColor())} />
            <span className="text-sm font-medium text-white">
              {summary.healthScore}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-xs text-white/70">{getTrendLabel()}</span>
          </div>
        </div>
        <Progress
          value={summary.healthScore}
          className="h-1.5"
          indicatorClassName={getProgressColor()}
        />
        {summary.suggestedActions.length > 0 && (
          <p className="text-xs text-white/60 italic">
            💡 {summary.suggestedActions[0]}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Heart className={cn('h-5 w-5', getHealthColor())} />
            Relationship Insights
            {personName && (
              <span className="text-white/60 font-normal text-sm">
                with {personName}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Health Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Relationship Health</span>
              <div className="flex items-center gap-2">
                <span className={cn('text-xl font-bold', getHealthColor())}>
                  {summary.healthScore}%
                </span>
                <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                  {getTrendIcon()}
                  <span className="text-xs text-white/70">{getTrendLabel()}</span>
                </div>
              </div>
            </div>
            <Progress
              value={summary.healthScore}
              className="h-2"
              indicatorClassName={getProgressColor()}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <Calendar className="h-4 w-4 text-purple-400 mx-auto mb-1" />
              <p className="text-lg font-semibold text-white">
                {summary.daysSinceContact ?? '—'}
              </p>
              <p className="text-xs text-white/60">Days ago</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <MessageSquare className="h-4 w-4 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-semibold text-white">
                {summary.totalInteractions}
              </p>
              <p className="text-xs text-white/60">Interactions</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <Target className="h-4 w-4 text-green-400 mx-auto mb-1" />
              <p className="text-lg font-semibold text-white">
                {summary.successRate}%
              </p>
              <p className="text-xs text-white/60">Success rate</p>
            </div>
          </div>

          {/* Mood Pattern */}
          {summary.moodPattern && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-sm text-white/80">
                <span className="text-purple-400">✨</span> {summary.moodPattern}
              </p>
            </div>
          )}

          {/* Strengths */}
          {summary.strengths.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {summary.strengths.map((strength, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-500/20 text-green-300 border-green-500/30"
                  >
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Areas to Improve */}
          {summary.areasToImprove.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                Areas to Improve
              </h4>
              <div className="flex flex-wrap gap-2">
                {summary.areasToImprove.map((area, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Actions */}
          {summary.suggestedActions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-purple-400" />
                Suggested Actions
              </h4>
              <ul className="space-y-1">
                {summary.suggestedActions.map((action, index) => (
                  <li
                    key={index}
                    className="text-sm text-white/70 flex items-start gap-2"
                  >
                    <span className="text-purple-400 mt-0.5">→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Summary */}
          <div className="pt-2 border-t border-white/10">
            {!showAISummary ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAISummary(true)}
                className="w-full text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI-powered insights
              </Button>
            ) : aiLoading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-5 w-5 animate-spin text-purple-400 mr-2" />
                <span className="text-sm text-white/60">
                  Generating insights...
                </span>
              </div>
            ) : aiSummary ? (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/80">{aiSummary}</p>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
