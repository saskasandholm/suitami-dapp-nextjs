'use client';

import MemberGrowthChart from '@/components/charts/MemberGrowthChart';
import HourlyActivityChart from '@/components/charts/HourlyActivityChart';
import SentimentChart from '@/components/charts/SentimentChart';
import CurrentSentimentChart from '@/components/charts/CurrentSentimentChart';
import SentimentChartSkeleton from '@/components/charts/SentimentChartSkeleton';
import type { TimeRange } from '@/types/community';

interface MemberData {
  date: string;
  total: number;
  active: number;
  new: number;
}

interface HourlyData {
  hour: string;
  messages: number;
  reactions: number;
  threads: number;
}

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface CommunityChartsProps {
  memberGrowthData: MemberData[];
  hourlyActivity: HourlyData[];
  selectedTimeRange: TimeRange;
  isSentimentLoading: boolean;
  sentimentData: any[]; // Replace 'any' with proper type from your community types
  currentSentiment: SentimentData;
}

export function CommunityCharts({
  memberGrowthData,
  hourlyActivity,
  selectedTimeRange,
  isSentimentLoading,
  sentimentData,
  currentSentiment,
}: CommunityChartsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MemberGrowthChart data={memberGrowthData} selectedRange={selectedTimeRange} />

        <HourlyActivityChart data={hourlyActivity} selectedDate={new Date().toLocaleDateString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isSentimentLoading ? (
          <SentimentChartSkeleton />
        ) : (
          <SentimentChart data={sentimentData} selectedRange={selectedTimeRange} />
        )}

        <CurrentSentimentChart
          data={{
            positive: currentSentiment.positive,
            neutral: currentSentiment.neutral,
            negative: currentSentiment.negative,
          }}
        />
      </div>
    </>
  );
}
