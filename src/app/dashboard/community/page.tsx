'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, Title, Text, DonutChart, AreaChart, Grid } from '@tremor/react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  HeartIcon,
  ExclamationCircleIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { TimeRange, CommunityMetrics } from '@/types/community';
import { chartStyles } from '@/styles/chartStyles';
import { useCommunityData } from '@/hooks/useCommunityData';
import PageHeader from '@/components/layout/PageHeader';

// Import our custom chart components
import MemberGrowthChart from '@/components/charts/MemberGrowthChart';
import HourlyActivityChart from '@/components/charts/HourlyActivityChart';
import TrendingTopicsChart from '@/components/charts/TrendingTopicsChart';
import SentimentChart from '@/components/charts/SentimentChart';
import CurrentSentimentChart from '@/components/charts/CurrentSentimentChart';
import SentimentChartSkeleton from '@/components/charts/SentimentChartSkeleton';
import TrendingTopicsChartSkeleton from '@/components/charts/TrendingTopicsChartSkeleton';

// Time range options for analytics
const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'Custom', value: 'custom' },
];

type PlatformName = 'telegram' | 'discord' | 'twitter';

interface _Platform {
  name: PlatformName;
  icon: React.ElementType;
  color: string;
}

interface _HourlyData {
  hour: string;
  messages: number;
  reactions: number;
  threads: number;
}

interface MemberData {
  date: string;
  total: number;
  active: number;
  new: number;
}

const memberGrowthData: MemberData[] = [
  { date: '2024-02-01', total: 1200, active: 800, new: 50 },
  { date: '2024-02-02', total: 1250, active: 820, new: 45 },
  { date: '2024-02-03', total: 1295, active: 850, new: 55 },
  { date: '2024-02-04', total: 1350, active: 880, new: 60 },
  { date: '2024-02-05', total: 1410, active: 900, new: 48 },
  { date: '2024-02-06', total: 1458, active: 925, new: 52 },
];

// Time series sentiment data for charts
interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

// Platform-specific sentiment data
interface PlatformSentimentData {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
  score: number;
}

interface TrendingTopic {
  topic: string;
  mentions: number;
  sentiment: number;
  trend: 'up' | 'down' | 'stable';
}

interface BaseMetrics {
  active: number;
  growth: string;
  engagement: number;
  sentiment: PlatformSentimentData;
  trendingTopics: TrendingTopic[];
}

interface ChatPlatformMetrics extends BaseMetrics {
  members: number;
  messages: number;
  peakHours: string[];
  topChannels: Array<{
    name: string;
    messages: number;
  }>;
}

interface TwitterMetrics extends BaseMetrics {
  followers: number;
  tweets: number;
  impressions: string;
  topContent: Array<{
    type: string;
    engagement: number;
  }>;
}

interface PlatformMetrics {
  telegram: ChatPlatformMetrics;
  discord: ChatPlatformMetrics;
  twitter: TwitterMetrics;
}

const sentimentData = [
  { date: 'Jan 1', positive: 65, neutral: 25, negative: 10, total: 100 },
  { date: 'Jan 8', positive: 70, neutral: 20, negative: 10, total: 100 },
  { date: 'Jan 15', positive: 60, neutral: 30, negative: 10, total: 100 },
  { date: 'Jan 22', positive: 75, neutral: 15, negative: 10, total: 100 },
  { date: 'Jan 29', positive: 80, neutral: 15, negative: 5, total: 100 },
];

const platformMetrics: PlatformMetrics = {
  telegram: {
    members: 1250,
    active: 850,
    messages: 2800,
    growth: '+12%',
    engagement: 68,
    peakHours: ['14:00', '20:00'],
    topChannels: [
      { name: 'General', messages: 1200 },
      { name: 'Support', messages: 850 },
      { name: 'Announcements', messages: 450 },
    ],
    sentiment: {
      positive: 65,
      neutral: 25,
      negative: 10,
      total: 100,
      trend: 'up',
      score: 78,
    },
    trendingTopics: [
      { topic: 'Product Update', mentions: 145, sentiment: 85, trend: 'up' },
      { topic: 'Support', mentions: 89, sentiment: 72, trend: 'stable' },
      { topic: 'Feature Request', mentions: 67, sentiment: 68, trend: 'up' },
    ],
  },
  discord: {
    members: 3500,
    active: 1850,
    messages: 5200,
    growth: '+15%',
    engagement: 75,
    peakHours: ['15:00', '21:00'],
    topChannels: [
      { name: 'general', messages: 2100 },
      { name: 'development', messages: 1500 },
      { name: 'support', messages: 950 },
    ],
    sentiment: {
      positive: 72,
      neutral: 20,
      negative: 8,
      total: 100,
      trend: 'up',
      score: 82,
    },
    trendingTopics: [
      { topic: 'Development', mentions: 234, sentiment: 88, trend: 'up' },
      { topic: 'Community Events', mentions: 156, sentiment: 92, trend: 'up' },
      { topic: 'Tutorials', mentions: 98, sentiment: 85, trend: 'stable' },
    ],
  },
  twitter: {
    followers: 2800,
    active: 1200,
    tweets: 180,
    growth: '+8%',
    engagement: 45,
    impressions: '125K',
    topContent: [
      { type: 'Tweet', engagement: 450 },
      { type: 'Reply', engagement: 280 },
      { type: 'Retweet', engagement: 320 },
    ],
    sentiment: {
      positive: 58,
      neutral: 32,
      negative: 10,
      total: 100,
      trend: 'stable',
      score: 74,
    },
    trendingTopics: [
      { topic: '#ProductLaunch', mentions: 178, sentiment: 82, trend: 'up' },
      { topic: '#CommunityGrowth', mentions: 134, sentiment: 88, trend: 'up' },
      { topic: '#TechTips', mentions: 89, sentiment: 76, trend: 'stable' },
    ],
  },
};

const hourlyActivity = [
  { hour: '00:00', messages: 120, reactions: 45, threads: 12 },
  { hour: '04:00', messages: 80, reactions: 30, threads: 8 },
  { hour: '08:00', messages: 250, reactions: 95, threads: 25 },
  { hour: '12:00', messages: 480, reactions: 180, threads: 48 },
  { hour: '16:00', messages: 520, reactions: 195, threads: 52 },
  { hour: '20:00', messages: 350, reactions: 130, threads: 35 },
];

// Anomaly detection thresholds (z-score)
const ANOMALY_THRESHOLD = 2;

// Platform links
const platformLinks = {
  telegram: 'https://t.me/your-community',
  discord: 'https://discord.gg/your-server',
  twitter: 'https://twitter.com/your-handle',
};

/**
 * Detects anomalies in a dataset using z-score analysis.
 * A z-score measures how many standard deviations a data point is from the mean.
 * Values beyond the threshold are considered anomalies.
 *
 * @param data - Array of numerical values to analyze
 * @param threshold - Z-score threshold for anomaly detection (default: 2 std deviations)
 * @returns Array of booleans indicating which values are anomalies
 */
const detectAnomalies = (data: number[], threshold: number = ANOMALY_THRESHOLD) => {
  const mean = data.reduce((sum, value) => sum + value) / data.length;
  const standardDeviation = Math.sqrt(
    data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length
  );
  return data.map(value => Math.abs((value - mean) / standardDeviation) > threshold);
};

/**
 * Calculates an overall community health score based on multiple metrics.
 * The score is a weighted average of:
 * - Sentiment score (40%): Community sentiment and satisfaction
 * - Engagement rate (30%): Active participation and interaction levels
 * - Growth rate (30%): Member/follower growth across platforms
 *
 * @param metrics - Platform-specific metrics for all platforms
 * @returns A health score between 0-100
 */
const calculateHealthScore = (metrics: CommunityMetrics): number => {
  console.log('Calculating health score with metrics:', JSON.stringify(metrics, null, 2));

  if (!metrics) {
    console.warn('No metrics data available');
    return 0;
  }

  // Initialize weights
  const weights = {
    sentiment: 0.4, // 40%
    engagement: 0.3, // 30%
    growth: 0.3, // 30%
  };

  let totalScore = 0;
  let appliedWeights = 0;

  // Calculate sentiment score (40%)
  if (metrics.sentiment?.score) {
    totalScore += metrics.sentiment.score * weights.sentiment;
    appliedWeights += weights.sentiment;
    console.log(
      'Applied sentiment score:',
      metrics.sentiment.score,
      'with weight:',
      weights.sentiment
    );
  } else {
    console.warn('No valid sentiment score available');
  }

  // Calculate engagement score (30%)
  if (metrics.engagement?.rate) {
    totalScore += metrics.engagement.rate * weights.engagement;
    appliedWeights += weights.engagement;
    console.log(
      'Applied engagement rate:',
      metrics.engagement.rate,
      'with weight:',
      weights.engagement
    );
  } else {
    console.warn('No valid engagement rate available');
  }

  // Calculate growth score (30%)
  if (metrics.growth?.rate) {
    // Normalize growth rate (assuming max healthy growth is 20%)
    const normalizedGrowth = Math.min(metrics.growth.rate / 20, 1);
    totalScore += normalizedGrowth * 100 * weights.growth;
    appliedWeights += weights.growth;
    console.log(
      'Applied normalized growth rate:',
      normalizedGrowth * 100,
      'with weight:',
      weights.growth
    );
  } else {
    console.warn('No valid growth rate available');
  }

  // If no weights were applied, return 0
  if (appliedWeights === 0) {
    console.warn('No weights were applied during health score calculation');
    return 0;
  }

  // Normalize the score based on applied weights
  const finalScore = totalScore / appliedWeights;
  console.log('Final health score:', finalScore);

  return Math.round(Math.min(Math.max(finalScore, 0), 100));
};

// Add metrics type and initialization
const metrics: CommunityMetrics = {
  sentiment: {
    positive: 65,
    neutral: 25,
    negative: 10,
    trend: 'up',
  },
  // ... other metrics
};

interface _UseCommunityDataReturn {
  data: {
    metrics: CommunityMetrics | null;
    sentiment: SentimentData[];
    topics: TrendingTopic[];
  };
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface ChartEntry {
  name?: string | number;
  value?: string | number | (string | number)[] | undefined;
}

export default function CommunityPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24h');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName | 'all'>('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isMetricsLoading, isSentimentLoading, isTopicsLoading, error, refetch } =
    useCommunityData({
      timeRange: selectedTimeRange,
      platform: selectedPlatform,
    });

  // Calculate health score with proper null checks
  const healthScore = useMemo(() => {
    if (!isClient || isMetricsLoading) {
      console.log('Health score calculation: Loading metrics...');
      return null;
    }

    if (error) {
      console.error('Health score calculation: Error loading metrics:', error);
      return null;
    }

    if (!data?.metrics) {
      console.log('Health score calculation: No metrics available');
      return null;
    }

    return calculateHealthScore(data.metrics);
  }, [data?.metrics, isMetricsLoading, error, isClient]);

  // Handle time range change
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
  };

  // Handle platform change
  const _handlePlatformChange = (platform: 'all' | PlatformName) => {
    setSelectedPlatform(platform);
  };

  // Handle refresh
  const _handleRefresh = async () => {
    await refetch(true); // Force refresh the data
  };

  // Detect anomalies in member growth
  const memberGrowthValues = memberGrowthData.map(d => d.total);
  const growthAnomalies = detectAnomalies(memberGrowthValues);

  const getSelectedPlatformMetrics = () => {
    if (selectedPlatform === 'all') {
      return platformMetrics.discord; // Default to discord for all view
    }
    return platformMetrics[selectedPlatform];
  };

  const totalMembers = Object.values(platformMetrics).reduce(
    (acc, platform) => acc + (platform.members || platform.followers || 0),
    0
  );

  const totalActive = Object.values(platformMetrics).reduce(
    (acc, platform) => acc + platform.active,
    0
  );

  const totalMessages = platformMetrics.telegram.messages + platformMetrics.discord.messages;
  const averageEngagement = Math.round(
    (platformMetrics.telegram.engagement +
      platformMetrics.discord.engagement +
      platformMetrics.twitter.engagement) /
      3
  );

  // Add no data state handling
  if (memberGrowthData.length === 0) {
    return (
      <div className="flex items-center justify-center h-72" role="status">
        <Text className="text-white/70">No data available for selected time range</Text>
      </div>
    );
  }

  // Add error boundary component
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="alert">
        <div className="text-center">
          <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <Text className="text-white mb-4">
            {typeof error === 'string' ? error : 'An error occurred while loading data'}
          </Text>
          <button
            onClick={() => refetch(true)}
            className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add loading state for the entire page only if all data is loading or client hasn't initialized
  const isInitialLoading = isMetricsLoading && isSentimentLoading && isTopicsLoading;
  if (!isClient || isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-accent mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Analytics"
        description="Monitor your community growth and engagement across platforms"
        rightContent={
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {timeRanges.map(range => (
                <button
                  key={range.value}
                  onClick={() => handleTimeRangeChange(range.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedTimeRange === range.value
                      ? 'bg-accent text-black'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              {Object.entries(platformLinks).map(([platform, link]) => {
                const isConnected = link && link !== '#' && !link.includes('your-');
                return (
                  <a
                    key={platform}
                    href={isConnected ? link : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isConnected
                        ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
                        : 'bg-white/5 opacity-50 cursor-not-allowed'
                    }`}
                    title={`${platform.charAt(0).toUpperCase() + platform.slice(1)} ${isConnected ? '(Connected)' : '(Not Connected)'}`}
                  >
                    {platform === 'telegram' && (
                      <PaperAirplaneIcon
                        className={`w-5 h-5 ${isConnected ? 'text-accent' : 'text-white/50'}`}
                      />
                    )}
                    {platform === 'discord' && (
                      <DiscordLogoIcon
                        className={`w-5 h-5 ${isConnected ? 'text-accent' : 'text-white/50'}`}
                      />
                    )}
                    {platform === 'twitter' && (
                      <TwitterLogoIcon
                        className={`w-5 h-5 ${isConnected ? 'text-accent' : 'text-white/50'}`}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Score Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card h-full">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32 rounded-xl bg-[#87fafd]/10 flex items-center justify-center">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 24 24" className="w-20 h-20">
                        <defs>
                          <clipPath id="heart-clip">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </clipPath>
                          <linearGradient id="wave-gradient" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#87fafd" />
                            <stop
                              offset={`${healthScore ? Math.max(0, Math.min(100, (healthScore / 90) * 100)) : 0}%`}
                              stopColor="#87fafd"
                            />
                            <stop
                              offset={`${healthScore ? Math.max(0, Math.min(100, (healthScore / 90) * 100)) : 0}%`}
                              stopColor="rgba(135, 250, 253, 0.1)"
                            />
                            <stop offset="100%" stopColor="rgba(135, 250, 253, 0.1)" />
                          </linearGradient>
                          <filter id="wave" x="0" y="0" width="100%" height="100%">
                            <feTurbulence
                              type="fractalNoise"
                              baseFrequency="0.01 0.05"
                              numOctaves="2"
                              result="noise"
                              seed="1"
                            >
                              <animate
                                attributeName="seed"
                                from="1"
                                to="2"
                                dur="1.5s"
                                repeatCount="indefinite"
                              />
                            </feTurbulence>
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                          </filter>
                        </defs>
                        {/* Background heart (filled with gradient) */}
                        <g clipPath="url(#heart-clip)">
                          <rect
                            x="0"
                            y="0"
                            width="24"
                            height="24"
                            fill="rgba(135, 250, 253, 0.1)"
                          />
                          <rect
                            x="0"
                            y="0"
                            width="24"
                            height="24"
                            fill="url(#wave-gradient)"
                            filter="url(#wave)"
                            className="transition-all duration-1000"
                          />
                        </g>
                        {/* Heart outline */}
                        <path
                          d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                          fill="none"
                          stroke="#87fafd"
                          strokeWidth="1"
                          strokeOpacity="0.6"
                          className="transition-all duration-1000"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <Text className="text-white/70 text-lg mb-1">Overall Health Score</Text>
                    {isMetricsLoading ? (
                      <div className="animate-pulse bg-white/10 h-12 w-32 rounded mt-1"></div>
                    ) : error ? (
                      <Text className="text-red-400 text-4xl">Error</Text>
                    ) : healthScore === null ? (
                      <Text className="text-yellow-400 text-4xl">N/A</Text>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-baseline space-x-2">
                          <Title className="text-white text-5xl font-semibold">
                            {healthScore.toFixed(1)}
                          </Title>
                          <Text className="text-white/50">/ 100</Text>
                        </div>
                        <div className="flex items-center space-x-2">
                          {healthScore >= 80 ? (
                            <ArrowUpCircleIcon className="w-5 h-5 text-emerald-400" />
                          ) : healthScore >= 60 ? (
                            <ArrowPathIcon className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <ArrowDownCircleIcon className="w-5 h-5 text-rose-400" />
                          )}
                          <Text
                            className={`text-sm ${
                              healthScore >= 80
                                ? 'text-emerald-400'
                                : healthScore >= 60
                                  ? 'text-yellow-400'
                                  : 'text-rose-400'
                            }`}
                          >
                            {healthScore >= 80
                              ? 'Healthy'
                              : healthScore >= 60
                                ? 'Needs Attention'
                                : 'Critical'}
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="border-l border-white/10 pl-8">
                  <Text className="text-white/70 text-lg mb-4">Key Insights</Text>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <ArrowUpCircleIcon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <Text className="text-white/90">
                        Discord shows strongest performance with 82% health score
                      </Text>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-yellow-400/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <ArrowPathIcon className="w-4 h-4 text-yellow-400" />
                      </div>
                      <Text className="text-white/90">
                        Telegram and Twitter need attention to improve engagement
                      </Text>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <ChartBarIcon className="w-4 h-4 text-accent" />
                      </div>
                      <Text className="text-white/90">
                        Overall trend is positive across all platforms
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform-specific health indicators */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(platformMetrics).map(([platform, metrics]) => (
                  <div
                    key={platform}
                    className="flex flex-col p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      {platform === 'telegram' && (
                        <PaperAirplaneIcon className="w-5 h-5 text-accent" />
                      )}
                      {platform === 'discord' && (
                        <DiscordLogoIcon className="w-5 h-5 text-accent" />
                      )}
                      {platform === 'twitter' && (
                        <TwitterLogoIcon className="w-5 h-5 text-accent" />
                      )}
                      <div className="text-base text-white/90 capitalize">{platform}</div>
                    </div>

                    <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics.sentiment.score}%` }}
                        className={`absolute h-full rounded-full ${
                          metrics.sentiment.score >= 80
                            ? 'bg-emerald-400'
                            : metrics.sentiment.score >= 60
                              ? 'bg-yellow-400'
                              : 'bg-rose-400'
                        }`}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-semibold text-white">
                          {metrics.sentiment.score}
                        </span>
                        <span className="text-sm text-white/50">/100</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {metrics.sentiment.trend === 'up' ? (
                          <ArrowUpCircleIcon className="w-4 h-4 text-emerald-400" />
                        ) : metrics.sentiment.trend === 'down' ? (
                          <ArrowDownCircleIcon className="w-4 h-4 text-rose-400" />
                        ) : (
                          <ArrowPathIcon className="w-4 h-4 text-yellow-400" />
                        )}
                        <span
                          className={`text-sm ${
                            metrics.sentiment.trend === 'up'
                              ? 'text-emerald-400'
                              : metrics.sentiment.trend === 'down'
                                ? 'text-rose-400'
                                : 'text-yellow-400'
                          }`}
                        >
                          {metrics.sentiment.trend === 'up'
                            ? 'Improving'
                            : metrics.sentiment.trend === 'down'
                              ? 'Declining'
                              : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trending Topics Card with independent loading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isTopicsLoading ? (
            <TrendingTopicsChartSkeleton />
          ) : (
            <TrendingTopicsChart topics={data.topics || []} />
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Members',
            value: Intl.NumberFormat('en', { notation: 'compact' }).format(totalMembers),
            icon: UserGroupIcon,
            change: '+12%',
            positive: true,
            hasAnomaly: growthAnomalies[growthAnomalies.length - 1],
          },
          {
            title: 'Active Members',
            value: Intl.NumberFormat('en', { notation: 'compact' }).format(totalActive),
            icon: HeartIcon,
            change: '+8%',
            positive: true,
          },
          {
            title: 'Messages (24h)',
            value: Intl.NumberFormat('en', { notation: 'compact' }).format(totalMessages),
            icon: ChatBubbleLeftRightIcon,
            change: '+15%',
            positive: true,
          },
          {
            title: 'Avg. Engagement',
            value: `${averageEngagement}%`,
            icon: ChartBarIcon,
            change: '+5%',
            positive: true,
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card hover-accent">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-[#87fafd]/10 flex items-center justify-center mr-4">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <Text className="text-white/70">{stat.title}</Text>
                    <Title className="text-white text-2xl">{stat.value}</Title>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stat.hasAnomaly && (
                    <ExclamationCircleIcon
                      className="w-5 h-5 text-yellow-400"
                      title="Unusual activity detected"
                    />
                  )}
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      stat.positive
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MemberGrowthChart data={memberGrowthData} selectedRange={selectedTimeRange} />

        <HourlyActivityChart data={hourlyActivity} selectedDate={new Date().toLocaleDateString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isSentimentLoading ? (
          <SentimentChartSkeleton />
        ) : (
          <SentimentChart data={data.sentiment || []} selectedRange={selectedTimeRange} />
        )}

        <CurrentSentimentChart
          data={{
            positive: data.metrics?.sentiment?.positive || 0,
            neutral: data.metrics?.sentiment?.neutral || 0,
            negative: data.metrics?.sentiment?.negative || 0,
          }}
        />
      </div>
    </div>
  );
}
