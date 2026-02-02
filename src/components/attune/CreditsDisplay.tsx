import { motion } from 'framer-motion';
import { Zap, AlertTriangle, Gift, Clock } from 'lucide-react';
import { useCreditsInfo } from '@/hooks/useCredits';

interface CreditsDisplayProps {
  compact?: boolean;
  className?: string;
}

const CreditsDisplay = ({ compact = false, className = '' }: CreditsDisplayProps) => {
  const { remaining, total, percentage, daysUntilReset, isLow, isEmpty, isLoading } = useCreditsInfo();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 w-16 bg-white/10 rounded" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <Zap className={`w-4 h-4 ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-purple-400'}`} />
        <span className={`text-sm font-medium ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-foreground/70'}`}>
          {remaining}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-white/5 border border-white/10 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isEmpty ? 'bg-red-500/20' : isLow ? 'bg-amber-500/20' : 'bg-purple-500/20'
          }`}>
            <Zap className={`w-4 h-4 ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-purple-400'}`} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground/90">Monthly Credits</h4>
            <p className="text-xs text-foreground/50">{remaining} of {total} remaining</p>
          </div>
        </div>
        {daysUntilReset !== null && daysUntilReset > 0 && (
          <div className="flex items-center gap-1 text-xs text-foreground/50">
            <Clock className="w-3 h-3" />
            <span>Resets in {daysUntilReset} days</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
        />
      </div>

      {/* Warning/Info Messages */}
      {isEmpty && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="text-red-400 font-medium">No credits remaining</p>
            <p className="text-foreground/50 mt-0.5">
              Your credits will reset at the start of next month. Upgrade for unlimited access.
            </p>
          </div>
        </div>
      )}

      {isLow && !isEmpty && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="text-amber-400 font-medium">Running low on credits</p>
            <p className="text-foreground/50 mt-0.5">
              You have {remaining} credits left this month.
            </p>
          </div>
        </div>
      )}

      {!isEmpty && !isLow && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <Gift className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="text-green-400 font-medium">Credits available</p>
            <p className="text-foreground/50 mt-0.5">
              Each conversation uses 1 credit. You're all set!
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreditsDisplay;
