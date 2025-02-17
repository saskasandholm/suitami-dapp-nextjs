'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TimeRange } from '@/types/community';
import { useCommunityData } from '@/hooks/useCommunityData';
import { useClientInit } from './hooks/useClientInit';
import { calculateCommunityMetrics } from './utils/metricCalculations';
import { AnalyticsPageHeader } from './components/AnalyticsPageHeader';
import { HealthScoreCard } from './components/HealthScoreCard';
import { TrendingTopicsChartContainer } from './components/TrendingTopicsChartContainer';
import { KeyMetricsCards } from './components/KeyMetricsCards';
import { CommunityCharts } from './components/CommunityCharts';
import { LoadingState } from './components/LoadingState';

// Platform links configuration
const platformLinks = {
  telegram: 'https://t.me/your-community',
  discord: 'https://discord.gg/your-server',
  twitter: 'https://twitter.com/your-handle',
};

export default function CommunityPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24h');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | string>('all');
  const isClient = useClientInit();

  const { data, isMetricsLoading, isSentimentLoading, isTopicsLoading, error, refetch } =
    useCommunityData({
      timeRange: selectedTimeRange,
      platform: selectedPlatform,
    });

  // Calculate metrics
  const metrics = data?.metrics ? calculateCommunityMetrics(data.metrics) : null;

  // Handle time range change
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
  };

  // Loading and error states
  const isInitialLoading = isMetricsLoading && isSentimentLoading && isTopicsLoading;
  const hasNoData = !isInitialLoading && !error && !data?.metrics;

  // Calculate health score
  const healthScore = data?.metrics
    ? Math.round(
        (data.metrics.telegram.sentiment.score +
          data.metrics.discord.sentiment.score +
          data.metrics.twitter.sentiment.score) /
          3
      )
    : null;

  return (
    <>
      <LoadingState
        isLoading={!isClient || isInitialLoading}
        error={error}
        noData={hasNoData}
        onRetry={() => refetch(true)}
      />

      {!isInitialLoading && !error && !hasNoData && (
        <div className="space-y-8">
          <AnalyticsPageHeader
            title="Community Analytics"
            description="Monitor your community growth and engagement across platforms"
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={handleTimeRangeChange}
            platformLinks={platformLinks}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <HealthScoreCard
                healthScore={healthScore}
                platformMetrics={data.metrics}
                isMetricsLoading={isMetricsLoading}
                error={error}
              />
            </motion.div>

            <TrendingTopicsChartContainer isLoading={isTopicsLoading} topics={data.topics || []} />
          </div>

          {metrics && (
            <KeyMetricsCards
              totalMembers={metrics.totalMembers}
              totalActive={metrics.totalActive}
              totalMessages={metrics.totalMessages}
              averageEngagement={metrics.averageEngagement}
              hasAnomalyInGrowth={data.growthAnomalies?.[data.growthAnomalies.length - 1] || false}
            />
          )}

          <CommunityCharts
            memberGrowthData={data.memberGrowth || []}
            hourlyActivity={data.hourlyActivity || []}
            selectedTimeRange={selectedTimeRange}
            isSentimentLoading={isSentimentLoading}
            sentimentData={data.sentiment || []}
            currentSentiment={{
              positive: data.metrics?.telegram.sentiment.positive || 0,
              neutral: data.metrics?.telegram.sentiment.neutral || 0,
              negative: data.metrics?.telegram.sentiment.negative || 0,
            }}
          />
        </div>
      )}
    </>
  );
}
