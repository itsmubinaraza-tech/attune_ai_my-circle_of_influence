import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
  Phone,
  Video,
  Users,
  MessageSquare,
  Mail,
  Share2,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonInteractions, useInteractionStats, useDeleteInteraction } from "@/hooks/useInteractions";
import { decodeContext, INTERACTION_TYPES, type InteractionType } from "@/services/interactions";
import type { Interaction, InteractionOutcome } from "@/types/database";

interface InteractionHistoryProps {
  personId: string;
  personName: string;
  compact?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Video,
  Users,
  MessageSquare,
  Mail,
  Share2,
  Calendar,
  MoreHorizontal,
};

const getTypeIcon = (type: InteractionType): React.ElementType => {
  const found = INTERACTION_TYPES.find(t => t.value === type);
  return found ? iconMap[found.icon] : MoreHorizontal;
};

const getTypeLabel = (type: InteractionType): string => {
  const found = INTERACTION_TYPES.find(t => t.value === type);
  return found?.label || 'Other';
};

const outcomeConfig: Record<InteractionOutcome, { icon: React.ElementType; color: string; label: string }> = {
  successful: { icon: CheckCircle2, color: 'text-green-400', label: 'Went Great' },
  partial: { icon: MinusCircle, color: 'text-yellow-400', label: 'Mixed' },
  unsuccessful: { icon: AlertCircle, color: 'text-red-400', label: 'Challenging' },
};

const moodEmojis: Record<string, string> = {
  great: '😊',
  good: '🙂',
  neutral: '😐',
  anxious: '😰',
  stressed: '😓',
};

interface InteractionCardProps {
  interaction: Interaction;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const InteractionCard = ({ interaction, onDelete, isDeleting }: InteractionCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { type, description } = decodeContext(interaction.context);
  const TypeIcon = getTypeIcon(type);
  const outcomeInfo = interaction.outcome ? outcomeConfig[interaction.outcome] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
    >
      {/* Main Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
      >
        {/* Type Icon */}
        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-5 h-5 text-violet-300" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white text-sm">{getTypeLabel(type)}</span>
            {outcomeInfo && (
              <outcomeInfo.icon className={`w-4 h-4 ${outcomeInfo.color}`} />
            )}
          </div>
          <p className="text-xs text-white/50">
            {formatDistanceToNow(new Date(interaction.interaction_date), { addSuffix: true })}
          </p>
        </div>

        {/* Mood Change */}
        {interaction.mood_before && interaction.mood_after && (
          <div className="flex items-center gap-1 text-lg">
            <span>{moodEmojis[interaction.mood_before] || '😐'}</span>
            <span className="text-white/30">→</span>
            <span>{moodEmojis[interaction.mood_after] || '😐'}</span>
          </div>
        )}

        {/* Expand Icon */}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-white/10 pt-3">
              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4" />
                {format(new Date(interaction.interaction_date), 'MMMM d, yyyy')}
              </div>

              {/* Description */}
              {description && (
                <div className="text-sm text-white/80">
                  <span className="text-white/50">About: </span>
                  {description}
                </div>
              )}

              {/* What Worked */}
              {interaction.what_worked && (
                <div className="bg-green-500/10 rounded-lg p-2">
                  <p className="text-xs text-green-400 font-medium mb-1">What worked</p>
                  <p className="text-sm text-white/80">{interaction.what_worked}</p>
                </div>
              )}

              {/* What Didn't Work */}
              {interaction.what_didnt_work && (
                <div className="bg-orange-500/10 rounded-lg p-2">
                  <p className="text-xs text-orange-400 font-medium mb-1">Could improve</p>
                  <p className="text-sm text-white/80">{interaction.what_didnt_work}</p>
                </div>
              )}

              {/* Notes */}
              {interaction.notes && (
                <div className="text-sm text-white/70">
                  <span className="text-white/50">Notes: </span>
                  {interaction.notes}
                </div>
              )}

              {/* Delete Button */}
              <div className="pt-2 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(interaction.id);
                  }}
                  disabled={isDeleting}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InteractionHistory = ({ personId, personName, compact = false }: InteractionHistoryProps) => {
  const { data: interactions, isLoading } = usePersonInteractions(personId);
  const { data: stats } = useInteractionStats(personId);
  const deleteInteraction = useDeleteInteraction();
  const [showAll, setShowAll] = useState(false);

  const displayedInteractions = compact && !showAll
    ? (interactions || []).slice(0, 3)
    : (interactions || []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this interaction?')) {
      await deleteInteraction.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!interactions || interactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <Clock className="w-8 h-8 text-white/30" />
        </div>
        <p className="text-white/60 text-sm">No interactions logged yet</p>
        <p className="text-white/40 text-xs mt-1">
          Start tracking your connection with {personName}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      {stats && !compact && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/50">Total</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.successful}</p>
            <p className="text-xs text-white/50">Successful</p>
          </div>
          <div className="bg-violet-500/10 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <p className="text-xl font-bold text-violet-400">{stats.averagePerMonth}</p>
            </div>
            <p className="text-xs text-white/50">Per Month</p>
          </div>
        </div>
      )}

      {/* Interaction List */}
      <div className="space-y-2">
        {displayedInteractions.map((interaction) => (
          <InteractionCard
            key={interaction.id}
            interaction={interaction}
            onDelete={handleDelete}
            isDeleting={deleteInteraction.isPending}
          />
        ))}
      </div>

      {/* Show More/Less */}
      {compact && interactions.length > 3 && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="w-full text-white/60 hover:text-white hover:bg-white/10"
        >
          {showAll ? 'Show Less' : `Show All (${interactions.length})`}
        </Button>
      )}
    </div>
  );
};

export default InteractionHistory;
