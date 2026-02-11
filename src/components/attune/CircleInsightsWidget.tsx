import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Star,
  Activity,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCircleInsights } from '@/hooks/useSummaries';
import { cn } from '@/lib/utils';

interface CircleInsightsWidgetProps {
  compact?: boolean;
}

export function CircleInsightsWidget({ compact = false }: CircleInsightsWidgetProps) {
  const { data: insights, isLoading, error } = useCircleInsights();

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center text-white/60">
          <Users className="h-8 w-8 mx-auto mb-2 text-purple-400/60" />
          <p>Currently you don't have data to show health of your relationships</p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (insights.weeklyTrend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getTrendLabel = () => {
    switch (insights.weeklyTrend) {
      case 'up':
        return 'More active';
      case 'down':
        return 'Less active';
      default:
        return 'Steady';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 70) return 'text-green-400';
    if (health >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const totalHealthCategories =
    insights.healthDistribution.healthy +
    insights.healthDistribution.moderate +
    insights.healthDistribution.needsAttention;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 rounded-lg p-2.5 space-y-1.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-medium text-white">Circle Health</span>
          </div>
          <span className={cn('text-sm font-bold', getHealthColor(insights.averageHealth))}>
            {insights.averageHealth}%
          </span>
        </div>

        <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-white/10">
          {insights.healthDistribution.healthy > 0 && (
            <div
              className="bg-green-500 transition-all"
              style={{
                width: `${(insights.healthDistribution.healthy / totalHealthCategories) * 100}%`,
              }}
            />
          )}
          {insights.healthDistribution.moderate > 0 && (
            <div
              className="bg-yellow-500 transition-all"
              style={{
                width: `${(insights.healthDistribution.moderate / totalHealthCategories) * 100}%`,
              }}
            />
          )}
          {insights.healthDistribution.needsAttention > 0 && (
            <div
              className="bg-red-500 transition-all"
              style={{
                width: `${(insights.healthDistribution.needsAttention / totalHealthCategories) * 100}%`,
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-white/60">
          <span>{insights.totalPeople} people</span>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span>{getTrendLabel()}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Circle Insights
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <Users className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{insights.totalPeople}</p>
              <p className="text-xs text-white/60">People</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <MessageSquare className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{insights.totalInteractions}</p>
              <p className="text-xs text-white/60">Interactions</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <Heart className={cn('h-5 w-5 mx-auto mb-1', getHealthColor(insights.averageHealth))} />
              <p className={cn('text-2xl font-bold', getHealthColor(insights.averageHealth))}>
                {insights.averageHealth}%
              </p>
              <p className="text-xs text-white/60">Avg Health</p>
            </div>
          </div>

          {/* Health Distribution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Health Distribution</span>
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className="text-xs text-white/60">{getTrendLabel()} this week</span>
              </div>
            </div>

            <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-white/10">
              {insights.healthDistribution.healthy > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(insights.healthDistribution.healthy / totalHealthCategories) * 100}%`,
                  }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-green-500"
                />
              )}
              {insights.healthDistribution.moderate > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(insights.healthDistribution.moderate / totalHealthCategories) * 100}%`,
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-yellow-500"
                />
              )}
              {insights.healthDistribution.needsAttention > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(insights.healthDistribution.needsAttention / totalHealthCategories) * 100}%`,
                  }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-red-500"
                />
              )}
            </div>

            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-white/60">
                  Healthy ({insights.healthDistribution.healthy})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-white/60">
                  Moderate ({insights.healthDistribution.moderate})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-white/60">
                  Needs Attention ({insights.healthDistribution.needsAttention})
                </span>
              </div>
            </div>
          </div>

          {/* Group Breakdown */}
          {Object.keys(insights.groupBreakdown).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80">By Group</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(insights.groupBreakdown).map(([group, count]) => (
                  <div
                    key={group}
                    className="bg-white/5 rounded-lg px-3 py-2 flex items-center justify-between"
                  >
                    <span className="text-sm text-white/70 capitalize">{group}</span>
                    <span className="text-sm font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Most Connected */}
          {insights.mostConnected.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                Most Connected
              </h4>
              <div className="space-y-1">
                {insights.mostConnected.slice(0, 3).map((person, index) => (
                  <div
                    key={person.name}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40 w-4">{index + 1}.</span>
                      <span className="text-sm text-white">{person.name}</span>
                    </div>
                    <span className="text-xs text-white/60">
                      {person.interactions} interactions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Needs Attention */}
          {insights.needsAttention.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                Needs Attention
              </h4>
              <div className="space-y-1">
                {insights.needsAttention.slice(0, 3).map((person) => (
                  <div
                    key={person.name}
                    className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-white">{person.name}</span>
                    <span className="text-xs text-red-300">
                      {person.daysSinceContact === 999
                        ? 'No contact'
                        : `${person.daysSinceContact} days ago`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Activity */}
          {insights.recentActivity.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/80">This Week</h4>
              <div className="flex items-end gap-1 h-16">
                {insights.recentActivity.map((day, index) => {
                  const maxCount = Math.max(...insights.recentActivity.map((d) => d.count), 1);
                  const height = (day.count / maxCount) * 100;

                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 5)}%` }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cn(
                          'w-full rounded-t',
                          day.count > 0 ? 'bg-purple-500' : 'bg-white/10'
                        )}
                      />
                      <span className="text-[10px] text-white/40">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
