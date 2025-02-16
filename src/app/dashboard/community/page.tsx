'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Title,
  Text,
  DonutChart,
  AreaChart,
} from '@tremor/react';
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

// Time range options for analytics
const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'Custom', value: 'custom' }
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
  const weights = {
    sentiment: 0.4,
    engagement: 0.3,
    growth: 0.3
  };

  let score = 0;
  let totalWeight = 0;

  // Calculate sentiment score (40%)
  if (metrics.sentiment) {
    totalWeight += weights.sentiment;
    
    // Use the sentiment score directly if available
    if (metrics.sentiment.score) {
      score += metrics.sentiment.score * weights.sentiment;
    } else {
      // Calculate from components if no direct score
      const total = metrics.sentiment.positive + metrics.sentiment.neutral + metrics.sentiment.negative;
      if (total > 0) {
        const sentimentScore = (
          (metrics.sentiment.positive * 1) +
          (metrics.sentiment.neutral * 0.5) +
          (metrics.sentiment.negative * 0)
        ) / total;
        score += sentimentScore * 100 * weights.sentiment;
      }
    }
  }

  // Calculate engagement score (30%)
  if (metrics.engagement?.rate) {
    totalWeight += weights.engagement;
    score += metrics.engagement.rate * weights.engagement;
  }

  // Calculate growth score (30%)
  if (metrics.growth?.rate) {
    totalWeight += weights.growth;
    // Normalize growth rate (assuming max healthy growth is 20%)
    const normalizedGrowth = Math.min(metrics.growth.rate / 20, 1);
    score += normalizedGrowth * 100 * weights.growth;
  }

  // Normalize the score based on available weights
  if (totalWeight > 0) {
    score = (score / totalWeight) * 100;
  }

  return Math.round(score);
};

// Add metrics type and initialization
const metrics: CommunityMetrics = {
  sentiment: {
    positive: 65,
    neutral: 25,
    negative: 10,
    trend: 'up'
  }
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
  const { data, isLoading: loading, error, refetch } = useCommunityData(selectedTimeRange, selectedPlatform);

  // Calculate health score with proper null checks
  const healthScore = useMemo(() => {
    if (!data?.metrics) {
      console.log('Health score calculation: No metrics available');
      return 0;
    }

    return calculateHealthScore(data.metrics);
  }, [data?.metrics]);

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

  // Add loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-accent mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  const pageHeader = (
    <div className="flex items-center space-x-4">
      <div className="flex space-x-2">
        {timeRanges.map(range => (
          <button
            key={range.value}
            onClick={() => {
              handleTimeRangeChange(range.value);
            }}
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
        {Object.entries(platformLinks).map(([platform, link]) => (
          <a
            key={platform}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title={`Open ${platform}`}
          >
            {platform === 'telegram' && <PaperAirplaneIcon className="w-5 h-5 text-accent" />}
            {platform === 'discord' && <DiscordLogoIcon className="w-5 h-5 text-accent" />}
            {platform === 'twitter' && <TwitterLogoIcon className="w-5 h-5 text-accent" />}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Analytics"
        description="Monitor your community growth and engagement across platforms"
        rightContent={pageHeader}
      />

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-[#87fafd]/10 flex items-center justify-center">
                    <HeartIcon className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <Text className="text-white/70">Community Health Score</Text>
                    <Title className="text-white text-3xl">{healthScore.toFixed(1)}</Title>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {healthScore >= 80 ? (
                    <ArrowUpCircleIcon className="w-6 h-6 text-green-400" />
                  ) : healthScore >= 60 ? (
                    <ArrowPathIcon className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <ArrowDownCircleIcon className="w-6 h-6 text-red-400" />
                  )}
                  <Text
                    className={`text-sm ${
                      healthScore >= 80
                        ? 'text-green-400'
                        : healthScore >= 60
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {healthScore >= 80 ? 'Healthy' : healthScore >= 60 ? 'Needs Attention' : 'Critical'}
                  </Text>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <TrendingTopicsChart topics={getSelectedPlatformMetrics().trendingTopics} />
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
          <MemberGrowthChart
            data={memberGrowthData}
            selectedRange={selectedTimeRange}
          />

          <HourlyActivityChart
            data={hourlyActivity}
            selectedDate={new Date().toLocaleDateString()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card min-h-[500px]">
            <Title className="text-white mb-4">Community Sentiment Trends</Title>
            <div className="h-[400px] w-full">
              <AreaChart
                data={sentimentData}
                index="date"
                categories={['positive', 'neutral', 'negative']}
                colors={['emerald', 'yellow', 'rose']}
                stack={true}
                valueFormatter={(value) => `${value}%`}
                showLegend={true}
                showAnimation={true}
                className={chartStyles.areaChart.className}
                customTooltip={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  return (
                    <div className="bg-black/90 border border-accent/20 rounded-lg p-3 shadow-lg backdrop-blur-sm antialiased">
                      <div className="text-white/80 text-sm font-medium mb-2">{label}</div>
                      {payload.map((entry: ChartEntry, index: number) => (
                        <div key={index} className="flex items-center justify-between space-x-4 mb-1 last:mb-0">
                          <span className="text-white/70 text-sm capitalize">{entry.name}:</span>
                          <span className="text-accent font-medium">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
            </div>
          </Card>

          <Card className="glass-card min-h-[500px]">
            <Title className="text-white mb-4">Current Sentiment Distribution</Title>
            <div className="h-[400px] w-full">
              <DonutChart
                data={[
                  { name: 'Positive', value: metrics.sentiment.positive },
                  { name: 'Neutral', value: metrics.sentiment.neutral },
                  { name: 'Negative', value: metrics.sentiment.negative }
                ]}
                category="value"
                index="name"
                colors={['emerald', 'yellow', 'rose']}
                valueFormatter={(value) => `${value}%`}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}