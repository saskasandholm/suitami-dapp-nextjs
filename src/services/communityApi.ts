import type {
  PlatformMetrics,
  SentimentData,
  TrendingTopic,
  HourlyActivityConfig,
} from '@/types/community';
import {
  generateMockAllPlatformMetrics,
  generateMockPlatformMetrics,
  generateMockSentimentData,
  generateMockTrendingTopics,
} from '@/mocks/communityMockData';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_PREFIX = 'community_data_';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  duration?: number;
  forceRefresh?: boolean;
}

interface CommunityDataParams {
  timeRange?: string;
  platform?: string;
  hourlyActivityConfig?: HourlyActivityConfig;
}

// Cache utility functions
function getCacheKey(baseKey: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = params[key];
        return acc;
      },
      {} as Record<string, any>
    );

  const paramString = JSON.stringify(sortedParams);
  return `${CACHE_PREFIX}${baseKey}_${paramString}`;
}

function setCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to set cache:', error);
  }
}

function getCache<T>(key: string, config?: CacheConfig): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const duration = config?.duration ?? CACHE_DURATION;

    if (config?.forceRefresh || Date.now() - entry.timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.warn('Failed to get cache:', error);
    return null;
  }
}

// API endpoints
const BASE_URL = '/api/community';

// Error type
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fetch wrapper with error handling
async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new ApiError(response.status, `API request failed: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to fetch data: ${(error as Error).message}`);
  }
}

// API functions
export async function fetchCommunityMetrics(
  platform: string,
  timeRange: string,
  config?: CacheConfig & { hourlyActivityConfig?: HourlyActivityConfig }
): Promise<PlatformMetrics> {
  console.log('fetchCommunityMetrics called:', { platform, timeRange, config });

  try {
    const cacheKey = getCacheKey('metrics', { platform, timeRange });
    const cached = getCache<PlatformMetrics>(cacheKey, config);
    if (cached) {
      console.log('Returning cached metrics data');
      return cached;
    }

    // Construct URL with query parameters
    const url = new URL(BASE_URL, window.location.origin);
    url.searchParams.set('platform', platform);
    url.searchParams.set('timeRange', timeRange);
    if (config?.hourlyActivityConfig) {
      url.searchParams.set('hourlyActivityConfig', JSON.stringify(config.hourlyActivityConfig));
    }

    // Fetch data from API
    const response = await fetchWithErrorHandling<{
      metrics: PlatformMetrics;
      sentiment: SentimentData[];
      topics: TrendingTopic[];
      hourlyActivity: any[];
    }>(url.toString());

    if (!response.metrics) {
      throw new Error('Invalid response: Missing metrics data');
    }

    // Cache and return metrics
    setCache(cacheKey, response.metrics);
    return response.metrics;
  } catch (error) {
    console.error('Error in fetchCommunityMetrics:', error);
    throw error instanceof ApiError
      ? error
      : new ApiError(
          500,
          `Failed to fetch metrics: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
  }
}

export async function fetchSentimentData(
  timeRange: string,
  config?: CacheConfig
): Promise<SentimentData[]> {
  console.log('fetchSentimentData called:', { timeRange, config });

  try {
    const cacheKey = getCacheKey('sentiment', { timeRange });
    const cached = getCache<SentimentData[]>(cacheKey, config);
    if (cached) {
      console.log('Returning cached sentiment data');
      return cached;
    }

    // Construct URL with query parameters
    const url = new URL(BASE_URL, window.location.origin);
    url.searchParams.set('timeRange', timeRange);

    // Fetch data from API
    const response = await fetchWithErrorHandling<{
      metrics: PlatformMetrics;
      sentiment: SentimentData[];
      topics: TrendingTopic[];
    }>(url.toString());

    if (!response.sentiment) {
      throw new Error('Invalid response: Missing sentiment data');
    }

    // Cache and return sentiment data
    setCache(cacheKey, response.sentiment);
    return response.sentiment;
  } catch (error) {
    console.error('Error in fetchSentimentData:', error);
    throw error instanceof ApiError
      ? error
      : new ApiError(
          500,
          `Failed to fetch sentiment data: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
  }
}

export async function fetchTrendingTopics(
  timeRange: string,
  config?: CacheConfig
): Promise<TrendingTopic[]> {
  console.log('fetchTrendingTopics called:', { timeRange, config });

  try {
    const cacheKey = getCacheKey('topics', { timeRange });
    const cached = getCache<TrendingTopic[]>(cacheKey, config);
    if (cached) {
      console.log('Returning cached topics data');
      return cached;
    }

    // Construct URL with query parameters
    const url = new URL(BASE_URL, window.location.origin);
    url.searchParams.set('timeRange', timeRange);

    // Fetch data from API
    const response = await fetchWithErrorHandling<{
      metrics: PlatformMetrics;
      sentiment: SentimentData[];
      topics: TrendingTopic[];
    }>(url.toString());

    if (!response.topics) {
      throw new Error('Invalid response: Missing topics data');
    }

    // Cache and return topics data
    setCache(cacheKey, response.topics);
    return response.topics;
  } catch (error) {
    console.error('Error in fetchTrendingTopics:', error);
    throw error instanceof ApiError
      ? error
      : new ApiError(
          500,
          `Failed to fetch trending topics: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
  }
}

// Cache management functions
export function clearCommunityCache(pattern?: string): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX) && (!pattern || key.includes(pattern))) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

export function getCacheMetrics(): {
  size: number;
  entries: number;
  oldestEntry: number;
  newestEntry: number;
} {
  try {
    const metrics = {
      size: 0,
      entries: 0,
      oldestEntry: Date.now(),
      newestEntry: 0,
    };

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          metrics.size += cached.length;
          metrics.entries++;
          const entry: CacheEntry<unknown> = JSON.parse(cached);
          metrics.oldestEntry = Math.min(metrics.oldestEntry, entry.timestamp);
          metrics.newestEntry = Math.max(metrics.newestEntry, entry.timestamp);
        }
      }
    });

    return metrics;
  } catch (error) {
    console.warn('Failed to get cache metrics:', error);
    return {
      size: 0,
      entries: 0,
      oldestEntry: Date.now(),
      newestEntry: Date.now(),
    };
  }
}

export function getCacheStatus(): Record<string, number> {
  const status: Record<string, number> = {};
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry: CacheEntry<unknown> = JSON.parse(cached);
          status[key] = Date.now() - entry.timestamp;
        }
      }
    });
  } catch (error) {
    console.warn('Failed to get cache status:', error);
  }
  return status;
}
