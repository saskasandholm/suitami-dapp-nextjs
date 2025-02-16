import { useState, useEffect } from 'react';
import type { CommunityMetrics, SentimentData, TrendingTopic } from '@/types/community';
import {
  fetchCommunityMetrics,
  fetchSentimentData,
  fetchTrendingTopics,
  ApiError
} from '@/services/communityApi';

interface CommunityData {
  metrics: CommunityMetrics | null;
  sentiment: SentimentData[] | null;
  topics: TrendingTopic[] | null;
}

interface UseCommunityDataReturn {
  data: CommunityData;
  isLoading: boolean;
  error: string | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
}

export function useCommunityData(
  timeRange: string = '24h',
  platform: string = 'all'
): UseCommunityDataReturn {
  const [data, setData] = useState<CommunityData>({
    metrics: null,
    sentiment: null,
    topics: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (forceRefresh: boolean = false) => {
    const startTime = performance.now();
    console.log(`[useCommunityData] Starting data fetch at ${new Date().toISOString()}`);
    console.log(`[useCommunityData] Parameters:`, { timeRange, platform, forceRefresh });

    try {
      setIsLoading(true);
      setError(null);

      console.log(`[useCommunityData] Fetching all data...`);
      const [metricsData, sentimentData, topicsData] = await Promise.all([
        fetchCommunityMetrics(platform, timeRange, { forceRefresh }),
        fetchSentimentData(timeRange, { forceRefresh }),
        fetchTrendingTopics(timeRange, { forceRefresh })
      ]);

      console.log(`[useCommunityData] Data fetch completed:`, {
        hasMetrics: !!metricsData,
        hasSentiment: !!sentimentData,
        hasTopics: !!topicsData,
        fetchTime: `${(performance.now() - startTime).toFixed(2)}ms`
      });

      setData({
        metrics: metricsData,
        sentiment: sentimentData,
        topics: topicsData
      });
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : 'Failed to fetch community data';
      console.error(`[useCommunityData] Error fetching data:`, message);
      setError(message);
    } finally {
      setIsLoading(false);
      console.log(`[useCommunityData] Data fetch cycle completed in ${(performance.now() - startTime).toFixed(2)}ms`);
    }
  };

  useEffect(() => {
    console.log(`[useCommunityData] Effect triggered with:`, { timeRange, platform });
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) {
        console.log(`[useCommunityData] Component unmounted, skipping data load`);
        return;
      }
      await fetchData();
    };

    loadData();

    return () => {
      isMounted = false;
      console.log(`[useCommunityData] Cleanup - component unmounting`);
    };
  }, [timeRange, platform]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
} 