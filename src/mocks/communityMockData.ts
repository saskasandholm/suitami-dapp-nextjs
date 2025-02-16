/**
 * Community Analytics Mock Data
 * Version: 0.13.8
 * 
 * This module provides mock data for the community analytics dashboard.
 * Recent updates include performance optimizations and improved type safety.
 */

import type { CommunityMetrics, SentimentData, TrendingTopic, PlatformMetrics } from '@/types/community';

// Helper function to generate random data within a range
const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate dates for the last n days
const generateDates = (days: number) => {
  const dates = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Generate mock sentiment data for the last n days
export const generateMockSentimentData = (days: number = 7): SentimentData[] => {
  return generateDates(days).map(date => ({
    date,
    positive: randomInRange(50, 70),
    neutral: randomInRange(20, 30),
    negative: randomInRange(5, 15),
    score: randomInRange(75, 90)
  }));
};

// Generate mock trending topics
export const generateMockTrendingTopics = (): TrendingTopic[] => [
  {
    topic: 'NFT Launch',
    mentions: randomInRange(200, 300),
    sentiment: randomInRange(80, 95),
    trend: 'up',
    relatedTopics: ['art', 'crypto', 'web3']
  },
  {
    topic: 'Community AMA',
    mentions: randomInRange(150, 250),
    sentiment: randomInRange(85, 95),
    trend: 'up',
    relatedTopics: ['events', 'governance']
  },
  {
    topic: 'Technical Update',
    mentions: randomInRange(100, 200),
    sentiment: randomInRange(70, 85),
    trend: 'stable',
    relatedTopics: ['development', 'blockchain']
  },
  {
    topic: 'Governance Proposal',
    mentions: randomInRange(80, 150),
    sentiment: randomInRange(60, 80),
    trend: 'down',
    relatedTopics: ['dao', 'voting']
  }
];

// Generate mock metrics for a specific platform
export const generateMockPlatformMetrics = (platform: string): CommunityMetrics => ({
  sentiment: {
    positive: randomInRange(60, 75),
    neutral: randomInRange(15, 25),
    negative: randomInRange(5, 15),
    trend: Math.random() > 0.7 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
    score: randomInRange(75, 90)
  },
  engagement: {
    rate: randomInRange(65, 85),
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down'
  },
  growth: {
    rate: randomInRange(8, 15),
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down'
  }
});

// Generate mock platform-specific metrics
export const generateMockAllPlatformMetrics = (): PlatformMetrics => {
  const baseMetrics = {
    telegram: {
      members: randomInRange(5000, 8000),
      active: randomInRange(2000, 4000),
      engagement: randomInRange(65, 85),
      growth: `${randomInRange(8, 15)}%`,
      sentiment: {
        positive: randomInRange(60, 75),
        neutral: randomInRange(15, 25),
        negative: randomInRange(5, 15),
        score: randomInRange(75, 90)
      },
      trendingTopics: generateMockTrendingTopics()
    },
    discord: {
      members: randomInRange(7000, 10000),
      active: randomInRange(3000, 5000),
      engagement: randomInRange(70, 90),
      growth: `${randomInRange(10, 18)}%`,
      sentiment: {
        positive: randomInRange(65, 80),
        neutral: randomInRange(15, 25),
        negative: randomInRange(5, 15),
        score: randomInRange(80, 95)
      },
      trendingTopics: generateMockTrendingTopics()
    },
    twitter: {
      followers: randomInRange(15000, 25000),
      active: randomInRange(5000, 8000),
      engagement: randomInRange(60, 80),
      growth: `${randomInRange(5, 12)}%`,
      sentiment: {
        positive: randomInRange(55, 70),
        neutral: randomInRange(20, 30),
        negative: randomInRange(10, 20),
        score: randomInRange(70, 85)
      },
      trendingTopics: generateMockTrendingTopics()
    }
  };

  // Ensure initial values are set
  Object.values(baseMetrics).forEach(platform => {
    if (platform.sentiment) {
      platform.sentiment.score = platform.sentiment.score || randomInRange(75, 90);
    }
  });

  return baseMetrics;
}; 