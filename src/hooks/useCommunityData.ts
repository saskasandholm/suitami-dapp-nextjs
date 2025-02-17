import { useState, useEffect } from 'react';
import type { PlatformMetrics, SentimentData, TrendingTopic } from '@/types/community';
import {
  fetchCommunityMetrics,
  fetchSentimentData,
  fetchTrendingTopics,
  ApiError,
} from '@/services/communityApi';

interface CommunityDataParams {
  timeRange?: string;
  platform?: string;
}

interface MemberGrowthData {
  date: string;
  total: number;
  active: number;
  new: number;
}

interface HourlyActivityData {
  hour: string;
  messages: number;
  reactions: number;
  threads: number;
}

interface CommunityDataReturn {
  data: {
    metrics: PlatformMetrics | null;
    sentiment: SentimentData[] | null;
    topics: TrendingTopic[] | null;
    memberGrowth: MemberGrowthData[];
    hourlyActivity: HourlyActivityData[];
    growthAnomalies: boolean[];
    healthScore: number | null;
  };
  isMetricsLoading: boolean;
  isSentimentLoading: boolean;
  isTopicsLoading: boolean;
  isMemberGrowthLoading: boolean;
  isHourlyActivityLoading: boolean;
  error: Error | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
}

export function useCommunityData({
  timeRange = '24h',
  platform = 'all',
}: CommunityDataParams = {}): CommunityDataReturn {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData[] | null>(null);
  const [topics, setTopics] = useState<TrendingTopic[] | null>(null);
  const [memberGrowth, setMemberGrowth] = useState<MemberGrowthData[]>([]);
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivityData[]>([]);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [isSentimentLoading, setIsSentimentLoading] = useState(true);
  const [isTopicsLoading, setIsTopicsLoading] = useState(true);
  const [isMemberGrowthLoading, setIsMemberGrowthLoading] = useState(true);
  const [isHourlyActivityLoading, setIsHourlyActivityLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (forceRefresh: boolean = false) => {
    setError(null);

    try {
      // Fetch all data in parallel
      setIsMetricsLoading(true);
      setIsSentimentLoading(true);
      setIsTopicsLoading(true);
      setIsMemberGrowthLoading(true);
      setIsHourlyActivityLoading(true);

      const response = await fetch(`/api/community?platform=${platform}&timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate and set metrics
      if (
        !data.metrics ||
        !data.metrics.telegram ||
        !data.metrics.discord ||
        !data.metrics.twitter
      ) {
        throw new Error('Invalid metrics data: Missing required platform data');
      }
      setMetrics(data.metrics);
      setIsMetricsLoading(false);

      // Validate and set sentiment data
      if (!data.sentiment || !Array.isArray(data.sentiment)) {
        throw new Error('Invalid sentiment data: Expected an array of sentiment data');
      }
      setSentiment(data.sentiment);
      setIsSentimentLoading(false);

      // Validate and set topics data
      if (!data.topics || !Array.isArray(data.topics)) {
        throw new Error('Invalid topics data: Expected an array of trending topics');
      }
      setTopics(data.topics);
      setIsTopicsLoading(false);

      // Validate and set member growth data
      if (!data.memberGrowth || !Array.isArray(data.memberGrowth)) {
        throw new Error('Invalid member growth data: Expected an array of growth data');
      }
      setMemberGrowth(data.memberGrowth);
      setIsMemberGrowthLoading(false);

      // Validate and set hourly activity data
      if (!data.hourlyActivity || !Array.isArray(data.hourlyActivity)) {
        throw new Error('Invalid hourly activity data: Expected an array of activity data');
      }
      setHourlyActivity(data.hourlyActivity);
      setIsHourlyActivityLoading(false);
    } catch (err) {
      console.error('Error fetching community data:', err);
      setError(
        err instanceof Error ? err : new Error('An unexpected error occurred while fetching data')
      );
      // Reset loading states on error
      setIsMetricsLoading(false);
      setIsSentimentLoading(false);
      setIsTopicsLoading(false);
      setIsMemberGrowthLoading(false);
      setIsHourlyActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, platform]);

  return {
    data: {
      metrics,
      sentiment,
      topics,
      memberGrowth,
      hourlyActivity,
      growthAnomalies: [], // TODO: Implement growth anomalies detection
      healthScore: metrics
        ? Math.round(
            (metrics.telegram.sentiment.score +
              metrics.discord.sentiment.score +
              metrics.twitter.sentiment.score) /
              3
          )
        : null,
    },
    isMetricsLoading,
    isSentimentLoading,
    isTopicsLoading,
    isMemberGrowthLoading,
    isHourlyActivityLoading,
    error,
    refetch: fetchData,
  };
}
