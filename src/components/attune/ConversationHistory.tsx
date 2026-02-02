import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionsForPerson } from '@/hooks/useChat';
import { parseMessages } from '@/services/chat';
import type { CoachingSession } from '@/types/database';

interface ConversationHistoryProps {
  personId: string;
  personName: string;
  compact?: boolean;
  limit?: number;
}

export function ConversationHistory({
  personId,
  personName,
  compact = false,
  limit = 5,
}: ConversationHistoryProps) {
  const navigate = useNavigate();
  const { data: sessions = [], isLoading, error } = useSessionsForPerson(personId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getSessionPreview = (session: CoachingSession) => {
    const messages = parseMessages(session.messages);
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return 'New conversation';
    return lastUserMsg.content.length > 60
      ? lastUserMsg.content.slice(0, 60) + '...'
      : lastUserMsg.content;
  };

  const getMessageCount = (session: CoachingSession) => {
    const messages = parseMessages(session.messages);
    return messages.filter(m => m.role !== 'system').length;
  };

  const handleContinueConversation = (session: CoachingSession) => {
    navigate(`/chat?session=${session.id}`);
  };

  const handleNewConversation = () => {
    navigate(`/chat?person=${personId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-foreground/30" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-sm">
        Failed to load conversations
      </div>
    );
  }

  const displaySessions = limit ? sessions.slice(0, limit) : sessions;
  const hasMore = sessions.length > displaySessions.length;

  if (sessions.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-white/5 text-center">
        <MessageSquare className="w-8 h-8 text-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-foreground/50 mb-3">No conversations yet</p>
        <button
          onClick={handleNewConversation}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 mx-auto"
        >
          <Sparkles className="w-3 h-3" />
          Start a conversation about {personName}
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {displaySessions.map((session) => (
          <motion.button
            key={session.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleContinueConversation(session)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/80 truncate">
                {getSessionPreview(session)}
              </p>
              <div className="flex items-center gap-2 text-xs text-foreground/40 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{formatDate(session.created_at)}</span>
                <span>•</span>
                <span>{getMessageCount(session)} messages</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-purple-400 transition-colors flex-shrink-0" />
          </motion.button>
        ))}

        {hasMore && (
          <button
            onClick={() => navigate(`/chat?person=${personId}`)}
            className="w-full text-center py-2 text-xs text-foreground/50 hover:text-foreground/70 transition-colors"
          >
            View all {sessions.length} conversations
          </button>
        )}

        <button
          onClick={handleNewConversation}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          New Conversation
        </button>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {displaySessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground/80 text-sm mb-1">
                  {getSessionPreview(session)}
                </p>
                <div className="flex items-center gap-3 text-xs text-foreground/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(session.created_at)}
                  </span>
                  <span>{getMessageCount(session)} messages</span>
                  {session.mood && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 capitalize">
                      {session.mood}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleContinueConversation(session)}
                className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-xs hover:bg-purple-500/30 transition-colors flex items-center gap-1"
              >
                Continue
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => navigate(`/chat?person=${personId}`)}
          className="w-full text-center py-2 text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
        >
          View all {sessions.length} conversations →
        </button>
      )}

      <button
        onClick={handleNewConversation}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 text-white transition-colors"
      >
        <Sparkles className="w-4 h-4 text-purple-400" />
        Start New Conversation
      </button>
    </div>
  );
}

export default ConversationHistory;
