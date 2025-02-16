/// <reference types="jest" />

import {
  fetchCommunityMetrics,
  fetchSentimentData,
  fetchTrendingTopics,
  clearCommunityCache,
  getCacheMetrics,
  ApiError
} from '../communityApi';
import type { CommunityMetrics, SentimentData, TrendingTopic } from '@/types/community';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Community API Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Data Fetching', () => {
    describe('fetchCommunityMetrics', () => {
      const mockMetrics: CommunityMetrics = {
        sentiment: {
          positive: 70,
          neutral: 20,
          negative: 10,
          trend: 'up',
          score: 85
        },
        engagement: {
          rate: 80,
          trend: 'up'
        },
        growth: {
          rate: 15,
          trend: 'up'
        }
      };

      it('should fetch metrics successfully for specific platform', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMetrics)
        });

        const result = await fetchCommunityMetrics('discord', '7d');
        expect(result).toEqual(mockMetrics);
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/community/metrics?platform=discord&timeRange=7d',
          expect.any(Object)
        );
      });

      it('should handle different time ranges correctly', async () => {
        const timeRanges = ['24h', '7d', '30d', '90d', 'custom'];
        
        for (const range of timeRanges) {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetrics)
          });

          await fetchCommunityMetrics('discord', range);
          expect(mockFetch).toHaveBeenLastCalledWith(
            `/api/community/metrics?platform=discord&timeRange=${range}`,
            expect.any(Object)
          );
        }
      });

      it('should validate metric data structure', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMetrics)
        });

        const result = await fetchCommunityMetrics('discord', '7d');
        
        // Type checks
        expect(typeof result.sentiment.positive).toBe('number');
        expect(typeof result.sentiment.neutral).toBe('number');
        expect(typeof result.sentiment.negative).toBe('number');
        expect(['up', 'down', 'stable']).toContain(result.sentiment.trend);
        
        // Range checks
        expect(result.sentiment.positive).toBeGreaterThanOrEqual(0);
        expect(result.sentiment.positive).toBeLessThanOrEqual(100);
        expect(result.sentiment.neutral).toBeGreaterThanOrEqual(0);
        expect(result.sentiment.neutral).toBeLessThanOrEqual(100);
        expect(result.sentiment.negative).toBeGreaterThanOrEqual(0);
        expect(result.sentiment.negative).toBeLessThanOrEqual(100);
      });
    });

    describe('fetchSentimentData', () => {
      const mockSentimentData: SentimentData[] = [
        {
          date: '2024-02-16',
          positive: 65,
          neutral: 25,
          negative: 10,
          score: 82
        },
        {
          date: '2024-02-15',
          positive: 70,
          neutral: 20,
          negative: 10,
          score: 85
        }
      ];

      it('should fetch sentiment data successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSentimentData)
        });

        const result = await fetchSentimentData('7d');
        expect(result).toEqual(mockSentimentData);
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/community/sentiment?timeRange=7d',
          expect.any(Object)
        );
      });

      it('should validate sentiment data structure and values', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSentimentData)
        });

        const result = await fetchSentimentData('7d');
        
        result.forEach(day => {
          // Date format check
          expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          
          // Type checks
          expect(typeof day.positive).toBe('number');
          expect(typeof day.neutral).toBe('number');
          expect(typeof day.negative).toBe('number');
          expect(typeof day.score).toBe('number');
          
          // Range checks
          expect(day.positive).toBeGreaterThanOrEqual(0);
          expect(day.positive).toBeLessThanOrEqual(100);
          expect(day.neutral).toBeGreaterThanOrEqual(0);
          expect(day.neutral).toBeLessThanOrEqual(100);
          expect(day.negative).toBeGreaterThanOrEqual(0);
          expect(day.negative).toBeLessThanOrEqual(100);
          expect(day.score).toBeGreaterThanOrEqual(0);
          expect(day.score).toBeLessThanOrEqual(100);
          
          // Sum check
          expect(day.positive + day.neutral + day.negative).toBeCloseTo(100, 1);
        });
      });
    });

    describe('fetchTrendingTopics', () => {
      const mockTopics: TrendingTopic[] = [
        {
          topic: 'NFT Launch',
          mentions: 250,
          sentiment: 85,
          trend: 'up',
          relatedTopics: ['art', 'crypto']
        },
        {
          topic: 'Community AMA',
          mentions: 180,
          sentiment: 90,
          trend: 'stable'
        }
      ];

      it('should fetch trending topics successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTopics)
        });

        const result = await fetchTrendingTopics('7d');
        expect(result).toEqual(mockTopics);
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/community/trending-topics?timeRange=7d',
          expect.any(Object)
        );
      });

      it('should validate trending topics structure and values', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTopics)
        });

        const result = await fetchTrendingTopics('7d');
        
        result.forEach(topic => {
          // Type checks
          expect(typeof topic.topic).toBe('string');
          expect(typeof topic.mentions).toBe('number');
          expect(typeof topic.sentiment).toBe('number');
          expect(['up', 'down', 'stable']).toContain(topic.trend);
          
          // Optional fields check
          if (topic.relatedTopics) {
            expect(Array.isArray(topic.relatedTopics)).toBe(true);
            topic.relatedTopics.forEach(related => {
              expect(typeof related).toBe('string');
            });
          }
          
          // Range checks
          expect(topic.mentions).toBeGreaterThan(0);
          expect(topic.sentiment).toBeGreaterThanOrEqual(0);
          expect(topic.sentiment).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe('Error Handling', () => {
    describe('Network Errors', () => {
      it('should throw ApiError on network failure', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));
        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow('Failed to fetch data: Network error');
      });

      it('should throw ApiError on timeout', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Request timeout'));
        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow('Failed to fetch data: Request timeout');
      });

      it('should throw ApiError on DNS failure', async () => {
        mockFetch.mockRejectedValueOnce(new Error('DNS lookup failed'));
        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow('Failed to fetch data: DNS lookup failed');
      });
    });

    describe('HTTP Error Responses', () => {
      const httpErrors = [
        { status: 400, text: 'Bad Request', message: 'Invalid parameters' },
        { status: 401, text: 'Unauthorized', message: 'Authentication required' },
        { status: 403, text: 'Forbidden', message: 'Insufficient permissions' },
        { status: 404, text: 'Not Found', message: 'Resource not found' },
        { status: 429, text: 'Too Many Requests', message: 'Rate limit exceeded' },
        { status: 500, text: 'Internal Server Error', message: 'Server error' },
        { status: 502, text: 'Bad Gateway', message: 'Gateway error' },
        { status: 503, text: 'Service Unavailable', message: 'Service temporarily unavailable' },
        { status: 504, text: 'Gateway Timeout', message: 'Gateway timeout' }
      ];

      httpErrors.forEach(({ status, text, message }) => {
        it(`should handle ${status} ${text} response`, async () => {
          mockFetch.mockResolvedValueOnce({
            ok: false,
            status,
            statusText: text
          });

          await expect(fetchCommunityMetrics('discord', '7d'))
            .rejects
            .toThrow(`API request failed: ${text}`);
        });
      });

      it('should include response status in error object', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        });

        try {
          await fetchCommunityMetrics('discord', '7d');
          fail('Expected error to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ApiError);
          expect((error as ApiError).status).toBe(404);
        }
      });
    });

    describe('Response Parsing Errors', () => {
      it('should throw ApiError on invalid JSON response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON'))
        });

        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow('Failed to fetch data: Invalid JSON');
      });

      it('should throw ApiError on malformed response data', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ invalidData: true })
        });

        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow();
      });

      it('should handle empty response body', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(null)
        });

        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow();
      });
    });

    describe('Rate Limiting', () => {
      it('should handle rate limit with retry-after header', async () => {
        const headers = new Headers({
          'retry-after': '60'
        });

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          headers
        });

        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow('API request failed: Too Many Requests');
      });

      it('should handle rate limit without retry-after header', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          headers: new Headers()
        });

        await expect(fetchCommunityMetrics('discord', '7d'))
          .rejects
          .toThrow('API request failed: Too Many Requests');
      });
    });

    describe('Error Recovery', () => {
      it('should clear cache on authentication error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized'
        });

        try {
          await fetchCommunityMetrics('discord', '7d');
        } catch (error) {
          expect(mockLocalStorage.removeItem).toHaveBeenCalled();
        }
      });

      it('should preserve cache on network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        try {
          await fetchCommunityMetrics('discord', '7d');
        } catch (error) {
          expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
        }
      });
    });

    describe('Multiple Endpoints Error Handling', () => {
      type EndpointTest = {
        fn: (...args: any[]) => Promise<any>;
        args: [string] | [string, string];
      };

      const endpoints: EndpointTest[] = [
        { fn: fetchCommunityMetrics, args: ['discord', '7d'] },
        { fn: fetchSentimentData, args: ['7d'] },
        { fn: fetchTrendingTopics, args: ['7d'] }
      ];

      endpoints.forEach(({ fn, args }) => {
        it(`should handle network error for ${fn.name}`, async () => {
          mockFetch.mockRejectedValueOnce(new Error('Network error'));
          await expect(fn(...args))
            .rejects
            .toThrow('Failed to fetch data: Network error');
        });

        it(`should handle rate limiting for ${fn.name}`, async () => {
          mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 429,
            statusText: 'Too Many Requests'
          });

          await expect(fn(...args))
            .rejects
            .toThrow('API request failed: Too Many Requests');
        });

        it(`should handle invalid JSON for ${fn.name}`, async () => {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON'))
          });

          await expect(fn(...args))
            .rejects
            .toThrow('Failed to fetch data: Invalid JSON');
        });
      });
    });
  });

  describe('Cache Management', () => {
    const mockData = {
      sentiment: { positive: 70, neutral: 20, negative: 10, trend: 'up' }
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockLocalStorage.clear();
    });

    describe('Cache Storage', () => {
      it('should store fetched data in cache', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData)
        });

        await fetchCommunityMetrics('discord', '7d');
        
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
        const setItemCall = mockLocalStorage.setItem.mock.calls[0];
        const [key, value] = setItemCall;
        
        expect(key).toMatch(/^community_data_metrics_/);
        const cached = JSON.parse(value);
        expect(cached.data).toEqual(mockData);
        expect(cached.timestamp).toBeCloseTo(Date.now(), -2);
      });

      it('should use cached data when available and fresh', async () => {
        const cachedData = {
          data: mockData,
          timestamp: Date.now()
        };

        mockLocalStorage.getItem.mockImplementation((key) => {
          if (key.includes('metrics')) {
            return JSON.stringify(cachedData);
          }
          return null;
        });

        const result = await fetchCommunityMetrics('discord', '7d');
        
        expect(result).toEqual(mockData);
        expect(mockFetch).not.toHaveBeenCalled();
      });

      it('should ignore expired cache', async () => {
        const expiredData = {
          data: mockData,
          timestamp: Date.now() - 1000 * 60 * 6 // 6 minutes old
        };

        mockLocalStorage.getItem.mockImplementation((key) => {
          if (key.includes('metrics')) {
            return JSON.stringify(expiredData);
          }
          return null;
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData)
        });

        await fetchCommunityMetrics('discord', '7d');
        
        expect(mockFetch).toHaveBeenCalled();
      });

      it('should handle force refresh option', async () => {
        const cachedData = {
          data: mockData,
          timestamp: Date.now()
        };

        mockLocalStorage.getItem.mockImplementation((key) => {
          if (key.includes('metrics')) {
            return JSON.stringify(cachedData);
          }
          return null;
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData)
        });

        await fetchCommunityMetrics('discord', '7d', { forceRefresh: true });
        
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    describe('Cache Key Generation', () => {
      it('should generate consistent cache keys for same parameters', async () => {
        const keys = new Set();
        const params = [
          { platform: 'discord', timeRange: '7d' },
          { platform: 'discord', timeRange: '7d' },
          { platform: 'telegram', timeRange: '7d' },
        ];

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockData)
        });

        for (const param of params) {
          await fetchCommunityMetrics(param.platform, param.timeRange);
          const setItemCall = mockLocalStorage.setItem.mock.calls.pop();
          keys.add(setItemCall[0]);
        }

        // First two calls should generate same key, third should be different
        expect(keys.size).toBe(2);
      });

      it('should generate different cache keys for different parameters', async () => {
        const keys = new Set();
        const params = [
          { platform: 'discord', timeRange: '7d' },
          { platform: 'discord', timeRange: '24h' },
          { platform: 'telegram', timeRange: '7d' },
        ];

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockData)
        });

        for (const param of params) {
          await fetchCommunityMetrics(param.platform, param.timeRange);
          const setItemCall = mockLocalStorage.setItem.mock.calls.pop();
          keys.add(setItemCall[0]);
        }

        expect(keys.size).toBe(3);
      });
    });

    describe('Cache Clearing', () => {
      it('should clear all community cache entries', () => {
        // Set up some mock cache entries
        const mockEntries: Record<string, string> = {
          'community_data_metrics_1': 'data1',
          'community_data_sentiment_1': 'data2',
          'other_data': 'data3'
        };

        mockLocalStorage.getItem.mockImplementation((key: string) => mockEntries[key]);
        Object.keys(mockEntries).forEach(key => {
          mockLocalStorage.setItem(key, mockEntries[key]);
        });

        clearCommunityCache();

        // Should remove only community_data entries
        expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(2);
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('community_data_metrics_1');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('community_data_sentiment_1');
      });

      it('should clear cache entries matching pattern', () => {
        const mockEntries: Record<string, string> = {
          'community_data_metrics_1': 'data1',
          'community_data_sentiment_1': 'data2',
          'community_data_topics_1': 'data3'
        };

        mockLocalStorage.getItem.mockImplementation((key: string) => mockEntries[key]);
        Object.keys(mockEntries).forEach(key => {
          mockLocalStorage.setItem(key, mockEntries[key]);
        });

        clearCommunityCache('metrics');

        expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('community_data_metrics_1');
      });
    });

    describe('Cache Metrics', () => {
      it('should calculate cache metrics correctly', () => {
        const now = Date.now();
        const mockEntries: Record<string, string> = {
          'community_data_metrics_1': JSON.stringify({
            data: { value: 1 },
            timestamp: now - 1000
          }),
          'community_data_sentiment_1': JSON.stringify({
            data: { value: 2 },
            timestamp: now - 2000
          })
        };

        mockLocalStorage.getItem.mockImplementation((key: string) => mockEntries[key]);
        Object.keys(mockEntries).forEach(key => {
          mockLocalStorage.setItem(key, mockEntries[key]);
        });

        const metrics = getCacheMetrics();

        expect(metrics.entries).toBe(2);
        expect(metrics.size).toBeGreaterThan(0);
        expect(metrics.oldestEntry).toBe(now - 2000);
        expect(metrics.newestEntry).toBe(now - 1000);
      });

      it('should handle empty cache', () => {
        const metrics = getCacheMetrics();

        expect(metrics.entries).toBe(0);
        expect(metrics.size).toBe(0);
        expect(metrics.oldestEntry).toBe(Date.now());
        expect(metrics.newestEntry).toBe(0);
      });
    });
  });
}); 