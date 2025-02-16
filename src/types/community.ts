export interface CommunityMetrics {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    trend: 'up' | 'down' | 'stable';
    score?: number;
  };
  engagement?: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
  growth?: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
  // Add other metric types as needed
}

export interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  score: number;
}

export interface TrendingTopic {
  topic: string;
  mentions: number;
  sentiment: number;
  trend: 'up' | 'down' | 'stable';
  relatedTopics?: string[];
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'custom';

export interface PlatformMetrics {
  [platform: string]: {
    members?: number;
    followers?: number;
    active: number;
    engagement: number;
    growth: string;
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
      score: number;
    };
    trendingTopics: TrendingTopic[];
  };
} 