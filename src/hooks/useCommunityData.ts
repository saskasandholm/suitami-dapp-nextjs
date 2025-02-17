import { useState, useEffect } from 'react';
import type { CommunityMetrics, SentimentData, TrendingTopic } from '@/types/community';
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

interface CommunityDataReturn {
  data: {
    metrics: CommunityMetrics | null;
    sentiment: SentimentData[] | null;
    topics: TrendingTopic[] | null;
  };
  isMetricsLoading: boolean;
  isSentimentLoading: boolean;
  isTopicsLoading: boolean;
  error: Error | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
}

export function useCommunityData({
  timeRange = '24h',
  platform = 'all',
}: CommunityDataParams = {}): CommunityDataReturn {
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData[] | null>(null);
  const [topics, setTopics] = useState<TrendingTopic[] | null>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [isSentimentLoading, setIsSentimentLoading] = useState(true);
  const [isTopicsLoading, setIsTopicsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (forceRefresh: boolean = false) => {
    setError(null);

    try {
      // Fetch metrics
      setIsMetricsLoading(true);
      const metricsData = await fetchCommunityMetrics(platform, timeRange, { forceRefresh });
      setMetrics(metricsData);
      setIsMetricsLoading(false);

      // Fetch sentiment
      setIsSentimentLoading(true);
      const sentimentData = await fetchSentimentData(timeRange, { forceRefresh });
      setSentiment(sentimentData);
      setIsSentimentLoading(false);

      // Fetch topics
      setIsTopicsLoading(true);
      const topicsData = await fetchTrendingTopics(timeRange, { forceRefresh });
      setTopics(topicsData);
      setIsTopicsLoading(false);
    } catch (err) {
      setError(err as Error);
      // Reset loading states on error
      setIsMetricsLoading(false);
      setIsSentimentLoading(false);
      setIsTopicsLoading(false);
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
    },
    isMetricsLoading,
    isSentimentLoading,
    isTopicsLoading,
    error,
    refetch: fetchData,
  };
}
