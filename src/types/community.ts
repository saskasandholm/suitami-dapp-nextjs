// Base interfaces for platform metrics
export interface BasePlatformMetrics {
  active: number;
  engagement: number;
  growth: string;
  sentiment: PlatformSentimentData;
  trendingTopics: TrendingTopic[];
}

export interface PlatformSentimentData {
  positive: number;
  neutral: number;
  negative: number;
  score: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ChatPlatformMetrics extends BasePlatformMetrics {
  members: number;
  messages: number;
  peakHours: string[];
  topChannels: Array<{
    name: string;
    messages: number;
  }>;
}

export interface TwitterMetrics extends BasePlatformMetrics {
  followers: number;
  tweets: number;
  impressions: string;
  topContent: Array<{
    type: string;
    engagement: number;
  }>;
}

export interface PlatformMetrics {
  telegram: ChatPlatformMetrics;
  discord: ChatPlatformMetrics;
  twitter: TwitterMetrics;
}

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

export interface ActivityRange {
  min: number;
  max: number;
}

export interface HourlyActivityRanges {
  messages: ActivityRange;
  reactions: ActivityRange;
  threads: ActivityRange;
}

export interface PeakHours {
  weekday: number[]; // Array of peak hours (0-23)
  weekend: number[]; // Array of peak hours (0-23)
}

export interface ActivityMultipliers {
  night: number; // 00:00-06:59
  morning: number; // 07:00-08:59
  peak: number; // Configurable peak hours
  evening: number; // 18:00-23:59
}

export interface HourlyEventConfig {
  probability: number; // Probability of event occurring (0-1)
  magnitude: number; // Base magnitude of event impact (1-5)
  duration: number; // Duration in hours (1-4)
  types: ('ama' | 'launch' | 'announcement' | 'incident')[];
}

export interface HourlyActivityConfig {
  timezone?: string; // e.g., 'America/New_York'
  activityRanges?: HourlyActivityRanges;
  peakHours?: PeakHours;
  activityMultipliers?: ActivityMultipliers;
  dayOfWeekVariations?: {
    weekday: number; // Base multiplier for weekdays
    weekend: number; // Base multiplier for weekends
  };
  eventSimulation?: HourlyEventConfig;
  seed?: number; // For reproducible random generation
}

export interface HourlyActivityData {
  hour: string;
  messages: number;
  reactions: number;
  threads: number;
}
