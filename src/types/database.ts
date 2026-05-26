export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json | null
          subscription_tier: SubscriptionTier
          subscription_status: SubscriptionStatus
          stripe_customer_id: string | null
          subscription_ends_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
        }
      }
      subscription_events: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          event_type: string
          stripe_event_id: string | null
          tier: SubscriptionTier | null
          raw: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          event_type: string
          stripe_event_id?: string | null
          tier?: SubscriptionTier | null
          raw?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          event_type?: string
          stripe_event_id?: string | null
          tier?: SubscriptionTier | null
          raw?: Json | null
        }
      }
      people: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          nickname: string | null
          photo_url: string | null
          group: 'work' | 'family' | 'friends' | 'acquaintances'
          subgroup: string | null
          role: string | null
          email: string | null
          phone: string | null
          linkedin_url: string | null
          communication_style: Json | null
          motivations: string[] | null
          values: string[] | null
          goals: string[] | null
          notes: string | null
          last_contact: string | null
          relationship_health: number | null
          is_archived: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          nickname?: string | null
          photo_url?: string | null
          group: 'work' | 'family' | 'friends' | 'acquaintances'
          subgroup?: string | null
          role?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          communication_style?: Json | null
          motivations?: string[] | null
          values?: string[] | null
          goals?: string[] | null
          notes?: string | null
          last_contact?: string | null
          relationship_health?: number | null
          is_archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          nickname?: string | null
          photo_url?: string | null
          group?: 'work' | 'family' | 'friends' | 'acquaintances'
          subgroup?: string | null
          role?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          communication_style?: Json | null
          motivations?: string[] | null
          values?: string[] | null
          goals?: string[] | null
          notes?: string | null
          last_contact?: string | null
          relationship_health?: number | null
          is_archived?: boolean
        }
      }
      person_connections: {
        Row: {
          id: string
          created_at: string
          person_a_id: string
          person_b_id: string
          connection_type: 'knows' | 'works_with' | 'related_to'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          person_a_id: string
          person_b_id: string
          connection_type: 'knows' | 'works_with' | 'related_to'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          person_a_id?: string
          person_b_id?: string
          connection_type?: 'knows' | 'works_with' | 'related_to'
          notes?: string | null
        }
      }
      interactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          person_id: string
          interaction_date: string
          context: string | null
          outcome: 'successful' | 'partial' | 'unsuccessful' | null
          what_worked: string | null
          what_didnt_work: string | null
          mood_before: string | null
          mood_after: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          person_id: string
          interaction_date: string
          context?: string | null
          outcome?: 'successful' | 'partial' | 'unsuccessful' | null
          what_worked?: string | null
          what_didnt_work?: string | null
          mood_before?: string | null
          mood_after?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          person_id?: string
          interaction_date?: string
          context?: string | null
          outcome?: 'successful' | 'partial' | 'unsuccessful' | null
          what_worked?: string | null
          what_didnt_work?: string | null
          mood_before?: string | null
          mood_after?: string | null
          notes?: string | null
        }
      }
      coaching_sessions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          person_id: string | null
          messages: Json
          mood: string | null
          outcome_goal: string | null
          summary: string | null
          tokens_used: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          person_id?: string | null
          messages: Json
          mood?: string | null
          outcome_goal?: string | null
          summary?: string | null
          tokens_used?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          person_id?: string | null
          messages?: Json
          mood?: string | null
          outcome_goal?: string | null
          summary?: string | null
          tokens_used?: number | null
        }
      }
      user_credits: {
        Row: {
          id: string
          user_id: string
          credits_remaining: number
          credits_total: number
          reset_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credits_remaining?: number
          credits_total?: number
          reset_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          credits_remaining?: number
          credits_total?: number
          reset_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          person_id: string
          title: string
          message: string | null
          reminder_type: 'one_time' | 'recurring' | 'smart_nudge'
          scheduled_for: string
          frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | null
          status: 'pending' | 'completed' | 'snoozed' | 'dismissed'
          completed_at: string | null
          snoozed_until: string | null
          is_smart_nudge: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          person_id: string
          title: string
          message?: string | null
          reminder_type: 'one_time' | 'recurring' | 'smart_nudge'
          scheduled_for: string
          frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | null
          status?: 'pending' | 'completed' | 'snoozed' | 'dismissed'
          completed_at?: string | null
          snoozed_until?: string | null
          is_smart_nudge?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          person_id?: string
          title?: string
          message?: string | null
          reminder_type?: 'one_time' | 'recurring' | 'smart_nudge'
          scheduled_for?: string
          frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | null
          status?: 'pending' | 'completed' | 'snoozed' | 'dismissed'
          completed_at?: string | null
          snoozed_until?: string | null
          is_smart_nudge?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      group_type: 'work' | 'family' | 'friends' | 'acquaintances'
      connection_type: 'knows' | 'works_with' | 'related_to'
      interaction_outcome: 'successful' | 'partial' | 'unsuccessful'
      reminder_type: 'one_time' | 'recurring' | 'smart_nudge'
      reminder_status: 'pending' | 'completed' | 'snoozed' | 'dismissed'
      reminder_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
      subscription_tier: 'free' | 'starter' | 'growth' | 'premium'
      subscription_status: 'active' | 'past_due' | 'canceled' | 'incomplete'
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Person = Database['public']['Tables']['people']['Row']
export type PersonInsert = Database['public']['Tables']['people']['Insert']
export type PersonUpdate = Database['public']['Tables']['people']['Update']
export type PersonConnection = Database['public']['Tables']['person_connections']['Row']
export type Interaction = Database['public']['Tables']['interactions']['Row']
export type CoachingSession = Database['public']['Tables']['coaching_sessions']['Row']
export type UserCredits = Database['public']['Tables']['user_credits']['Row']
export type Reminder = Database['public']['Tables']['reminders']['Row']
export type ReminderInsert = Database['public']['Tables']['reminders']['Insert']
export type ReminderUpdate = Database['public']['Tables']['reminders']['Update']
export type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
export type InteractionUpdate = Database['public']['Tables']['interactions']['Update']

export type SubscriptionEvent = Database['public']['Tables']['subscription_events']['Row']

export type GroupType = 'work' | 'family' | 'friends' | 'acquaintances'
export type ConnectionType = 'knows' | 'works_with' | 'related_to'
export type InteractionOutcome = 'successful' | 'partial' | 'unsuccessful'
export type ReminderTypeEnum = 'one_time' | 'recurring' | 'smart_nudge'
export type ReminderStatus = 'pending' | 'completed' | 'snoozed' | 'dismissed'
export type ReminderFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly'

// Subscription / billing (Phase 2 / A1)
export type SubscriptionTier = 'free' | 'starter' | 'growth' | 'premium'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete'
