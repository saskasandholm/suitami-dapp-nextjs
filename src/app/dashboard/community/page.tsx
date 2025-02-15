'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  AreaChart,
  BarChart,
  DonutChart,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@tremor/react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  HeartIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  HashtagIcon,
  FaceSmileIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ExclamationCircleIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CalendarIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

// Time range options for analytics
const timeRanges = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'Custom', value: 'custom' },
];

type PlatformName = 'telegram' | 'discord' | 'twitter';

interface Platform {
  name: PlatformName;
  icon: any; // TODO: Add proper icon type
  color: string;
}

const platforms: Platform[] = [
  { name: 'telegram', icon: PaperAirplaneIcon, color: 'blue' },
  { name: 'discord', icon: DiscordLogoIcon, color: 'indigo' },
  { name: 'twitter', icon: TwitterLogoIcon, color: 'cyan' },
];

const memberGrowthData = [
  { date: 'Jan 1', 'Total Members': 1420, 'Active Members': 820, 'New Members': 45 },
  { date: 'Jan 8', 'Total Members': 1620, 'Active Members': 920, 'New Members': 52 },
  { date: 'Jan 15', 'Total Members': 1870, 'Active Members': 1100, 'New Members': 63 },
  { date: 'Jan 22', 'Total Members': 2140, 'Active Members': 1300, 'New Members': 71 },
  { date: 'Jan 29', 'Total Members': 2300, 'Active Members': 1580, 'New Members': 82 },
];

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
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
  sentiment: SentimentData;
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
  { date: 'Jan 1', score: 75 },
  { date: 'Jan 8', score: 82 },
  { date: 'Jan 15', score: 78 },
  { date: 'Jan 22', score: 85 },
  { date: 'Jan 29', score: 88 },
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
  { hour: '00:00', messages: 120 },
  { hour: '04:00', messages: 80 },
  { hour: '08:00', messages: 250 },
  { hour: '12:00', messages: 480 },
  { hour: '16:00', messages: 520 },
  { hour: '20:00', messages: 350 },
];

// Anomaly detection thresholds (z-score)
const ANOMALY_THRESHOLD = 2;

// Platform links
const platformLinks = {
  telegram: 'https://t.me/your-community',
  discord: 'https://discord.gg/your-server',
  twitter: 'https://twitter.com/your-handle',
};

// Function to detect anomalies using z-score
const detectAnomalies = (data: number[], threshold: number = ANOMALY_THRESHOLD) => {
  const mean = data.reduce((a, b) => a + b) / data.length;
  const stdDev = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
  return data.map(value => Math.abs((value - mean) / stdDev) > threshold);
};

// Function to calculate community health score
const calculateHealthScore = (metrics: PlatformMetrics) => {
  const weights = {
    growth: 0.3,
    engagement: 0.3,
    sentiment: 0.2,
    activity: 0.2,
  };

  const scores = {
    growth:
      Object.values(metrics).reduce(
        (acc, platform) => acc + parseFloat(platform.growth.replace('%', '')),
        0
      ) / 3,
    engagement: Object.values(metrics).reduce((acc, platform) => acc + platform.engagement, 0) / 3,
    sentiment:
      Object.values(metrics).reduce((acc, platform) => acc + platform.sentiment.score, 0) / 3,
    activity:
      Object.values(metrics).reduce(
        (acc, platform) =>
          acc + (platform.active / (platform.members || platform.followers || 1)) * 100,
        0
      ) / 3,
  };

  return Object.entries(weights).reduce(
    (total, [key, weight]) => total + scores[key as keyof typeof scores] * weight,
    0
  );
};

interface DrilldownData {
  date: string;
  hour: string;
  'Total Members': number;
  'Active Members': number;
  'New Members': number;
  messages: number;
}

// Hourly data for drill-down
const hourlyData: Record<string, DrilldownData[]> = {
  'Jan 1': [
    {
      date: 'Jan 1',
      hour: '00:00',
      'Total Members': 1420,
      'Active Members': 820,
      'New Members': 45,
      messages: 120,
    },
    {
      date: 'Jan 1',
      hour: '04:00',
      'Total Members': 1425,
      'Active Members': 825,
      'New Members': 5,
      messages: 80,
    },
    {
      date: 'Jan 1',
      hour: '08:00',
      'Total Members': 1430,
      'Active Members': 830,
      'New Members': 5,
      messages: 250,
    },
    {
      date: 'Jan 1',
      hour: '12:00',
      'Total Members': 1440,
      'Active Members': 840,
      'New Members': 10,
      messages: 480,
    },
    {
      date: 'Jan 1',
      hour: '16:00',
      'Total Members': 1450,
      'Active Members': 850,
      'New Members': 10,
      messages: 520,
    },
    {
      date: 'Jan 1',
      hour: '20:00',
      'Total Members': 1460,
      'Active Members': 860,
      'New Members': 10,
      messages: 350,
    },
  ],
  // Add similar data for other dates
};

// Custom chart styles
const chartStyles = {
  areaChart: {
    gradient: {
      from: 'rgba(135, 250, 253, 0.15)',
      to: 'rgba(135, 250, 253, 0.01)',
    },
    line: {
      stroke: '#87fafd',
      strokeWidth: 2,
    },
  },
  barChart: {
    bar: {
      radius: 4,
      gradient: {
        from: 'rgba(135, 250, 253, 0.2)',
        to: 'rgba(135, 250, 253, 0.05)',
      },
    },
  },
  donutChart: {
    track: {
      stroke: 'rgba(255, 255, 255, 0.05)',
      strokeWidth: 2,
    },
  },
};

// Custom tooltip component
const CustomTooltip = ({ payload, active, label }: any) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-black/80 border border-accent/20 rounded-lg p-3 shadow-lg">
      <div className="text-white/70 text-sm mb-1">{label}</div>
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center justify-between space-x-4">
          <span className="text-white text-sm">{item.name}:</span>
          <span className="text-accent font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function CommunityPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName | 'all'>('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Add accessibility labels for charts
  const chartLabels = {
    memberGrowth: 'Member growth over time showing total, active, and new members',
    hourlyActivity: 'Hourly message activity distribution',
    sentiment: 'Community sentiment trends over time',
    topicTrends: 'Top trending topics with engagement metrics',
  };

  // Add loading states for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulated data fetch - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to load community data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTimeRange, selectedPlatform]);

  // Calculate health score
  const healthScore = calculateHealthScore(platformMetrics);

  // Detect anomalies in member growth
  const memberGrowthValues = memberGrowthData.map(d => d['Total Members']);
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

  // Function to handle chart click for drill-down
  const handleChartClick = (date: string) => {
    setSelectedDate(date);
  };

  // Function to handle metric click for detailed view
  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric);
  };

  // Function to export data as CSV
  const exportData = () => {
    const data = selectedDate ? hourlyData[selectedDate] : memberGrowthData;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `community-data-${selectedDate || 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
          <Text className="text-white mb-4">{error}</Text>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
          <Text className="text-white">Loading community data...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Community Analytics</h1>
          <p className="page-description">
            Monitor your community growth and engagement across platforms
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => {
                  setSelectedTimeRange(range.value);
                  if (range.value === 'custom') {
                    setShowDatePicker(true);
                  }
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
      </div>

      {/* Health Score */}
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

      {/* Quick Stats with Anomaly Indicators */}
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

      {/* Custom Date Range Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Select Date Range</h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-white/70 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={e => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">End Date</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={e => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <button
                onClick={() => {
                  // Handle custom date range
                  setShowDatePicker(false);
                }}
                className="w-full bg-accent text-black py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Selection */}
      <div className="flex space-x-4">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            selectedPlatform === 'all'
              ? 'bg-accent text-black'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <HashtagIcon className="w-5 h-5 mr-2" />
          All Platforms
        </button>
        {platforms.map(platform => (
          <button
            key={platform.name}
            onClick={() => setSelectedPlatform(platform.name.toLowerCase() as PlatformName)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              selectedPlatform === platform.name.toLowerCase()
                ? 'bg-accent text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <platform.icon className="w-5 h-5 mr-2" />
            {platform.name}
          </button>
        ))}
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70"
        >
          <ArrowDownCircleIcon className="w-5 h-5 mr-2" />
          Export Data
        </button>
      </div>

      {/* Growth Charts with Drill-down */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <Title className="text-white">Member Growth</Title>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-accent hover:text-accent/80"
              >
                Back to Overview
              </button>
            )}
          </div>
          {selectedDate ? (
            <AreaChart
              className="h-72 mt-4 [&_.tremor-AreaChart-path]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]"
              data={hourlyData[selectedDate]}
              index="hour"
              categories={['Total Members', 'Active Members', 'New Members']}
              colors={['#87fafd', '#818cf8', '#34d399']}
              valueFormatter={number => Intl.NumberFormat('en').format(number).toString()}
              showAnimation={true}
              onValueChange={v => console.log('Hover value:', v)}
              showTooltip={true}
              showLegend={true}
              aria-label={chartLabels.memberGrowth}
              role="img"
              curveType="monotone"
              customTooltip={CustomTooltip}
            />
          ) : (
            <AreaChart
              className="h-72 mt-4 [&_.tremor-AreaChart-path]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]"
              data={memberGrowthData}
              index="date"
              categories={['Total Members', 'Active Members', 'New Members']}
              colors={['#87fafd', '#818cf8', '#34d399']}
              valueFormatter={number => Intl.NumberFormat('en').format(number).toString()}
              showAnimation={true}
              onValueChange={v => console.log('Hover value:', v)}
              showTooltip={true}
              showLegend={true}
              onClick={(v: any) => handleChartClick(v.date)}
              aria-label={chartLabels.memberGrowth}
              role="img"
              curveType="monotone"
              customTooltip={CustomTooltip}
            />
          )}
          <div className="text-white/50 text-sm mt-2">
            Last updated: {lastUpdated?.toLocaleString()}
          </div>
        </Card>

        <Card className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <Title className="text-white">Hourly Activity</Title>
            {selectedDate && <Text className="text-accent">{selectedDate}</Text>}
          </div>
          <BarChart
            className="h-72 mt-4 [&_.tremor-BarChart-bar]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]"
            data={selectedDate ? hourlyData[selectedDate] : hourlyActivity}
            index="hour"
            categories={['messages']}
            colors={['#87fafd']}
            valueFormatter={number => Intl.NumberFormat('en').format(number).toString()}
            showAnimation={true}
            onValueChange={v => console.log('Hover value:', v)}
            showTooltip={true}
            aria-label={chartLabels.hourlyActivity}
            role="img"
            customTooltip={CustomTooltip}
          />
        </Card>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Export Data</h3>
              <button
                onClick={() => setShowExport(false)}
                className="text-white/70 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Select Data to Export</label>
                <select
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                  value={selectedMetric || ''}
                  onChange={e => setSelectedMetric(e.target.value)}
                >
                  <option value="">All Metrics</option>
                  <option value="growth">Member Growth</option>
                  <option value="activity">Hourly Activity</option>
                  <option value="sentiment">Sentiment Analysis</option>
                </select>
              </div>
              <button
                onClick={() => {
                  exportData();
                  setShowExport(false);
                }}
                className="w-full bg-accent text-black py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <Title className="text-white">Community Sentiment</Title>
            <div className="flex items-center space-x-2">
              <FaceSmileIcon className="w-5 h-5 text-green-400" />
              <Text className="text-green-400">Positive Trend</Text>
            </div>
          </div>
          <AreaChart
            className="h-72 mt-4 [&_.tremor-AreaChart-path]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]"
            data={sentimentData}
            index="date"
            categories={['score']}
            colors={['#87fafd']}
            valueFormatter={value => `${value}%`}
            showAnimation={true}
            aria-label={chartLabels.sentiment}
            role="img"
            curveType="monotone"
            customTooltip={CustomTooltip}
          />
        </Card>

        <Card className="glass-card">
          <Title className="text-white mb-4">Trending Topics</Title>
          <div className="space-y-4">
            {getSelectedPlatformMetrics().trendingTopics.map((topic: TrendingTopic) => (
              <div
                key={topic.topic}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <HashtagIcon className="w-5 h-5 text-accent" />
                  <div>
                    <Text className="text-white font-medium">{topic.topic}</Text>
                    <Text className="text-white/50">{topic.mentions} mentions</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      topic.sentiment >= 80
                        ? 'bg-green-400/10 text-green-400'
                        : topic.sentiment >= 60
                          ? 'bg-yellow-400/10 text-yellow-400'
                          : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {topic.sentiment}% positive
                  </div>
                  <ArrowTrendingUpIcon
                    className={`w-5 h-5 ${
                      topic.trend === 'up'
                        ? 'text-green-400'
                        : topic.trend === 'down'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Platform Details */}
      <Card className="glass-card">
        <Title className="text-white mb-6">Platform Performance</Title>
        <TabGroup>
          <TabList className="border-b border-white/10">
            {platforms.map(platform => (
              <Tab key={platform.name} className="text-white/70 hover:text-accent">
                <platform.icon className="w-5 h-5 mr-2 inline-block" />
                {platform.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {platforms.map(platform => {
              const metrics = platformMetrics[platform.name];
              return (
                <TabPanel key={platform.name}>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Text className="text-white font-medium">Members</Text>
                        <div className="px-2 py-1 rounded-full text-xs bg-green-400/10 text-green-400">
                          {metrics.growth}
                        </div>
                      </div>
                      <Title className="text-white text-2xl mb-2">
                        {Intl.NumberFormat('en').format(
                          'followers' in metrics ? metrics.followers : metrics.members
                        )}
                      </Title>
                      <Text className="text-white/50">Active: {metrics.active}</Text>
                    </Card>

                    <Card className="glass-card p-6">
                      <Text className="text-white/70 mb-4">Sentiment Distribution</Text>
                      <div className="mb-4">
                        <DonutChart
                          data={[
                            {
                              name: 'Positive',
                              value: metrics.sentiment.positive,
                            },
                            {
                              name: 'Neutral',
                              value: metrics.sentiment.neutral,
                            },
                            {
                              name: 'Negative',
                              value: metrics.sentiment.negative,
                            },
                          ]}
                          category="value"
                          index="name"
                          colors={['#34d399', '#fbbf24', '#f87171']}
                          showAnimation={true}
                          valueFormatter={value => `${value}%`}
                          customTooltip={CustomTooltip}
                          className="[&_.tremor-DonutChart-slice]:drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <Text className="text-white">Overall Score</Text>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            metrics.sentiment.score >= 80
                              ? 'bg-green-400/10 text-green-400'
                              : metrics.sentiment.score >= 60
                                ? 'bg-yellow-400/10 text-yellow-400'
                                : 'bg-red-400/10 text-red-400'
                          }`}
                        >
                          {metrics.sentiment.score}%
                        </div>
                      </div>
                    </Card>

                    <Card className="glass-card p-6">
                      <Text className="text-white/70 mb-4">Top Topics</Text>
                      <div className="space-y-3">
                        {metrics.trendingTopics.map(topic => (
                          <div key={topic.topic} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <HashtagIcon className="w-4 h-4 text-accent" />
                              <Text className="text-white">{topic.topic}</Text>
                            </div>
                            <Text className="text-accent">
                              {Intl.NumberFormat('en').format(topic.mentions)}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabPanel>
              );
            })}
          </TabPanels>
        </TabGroup>
      </Card>

      {/* Engagement Metrics */}
      <Card className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <Title className="text-white">Engagement Analysis</Title>
          <div className="flex items-center space-x-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            <Text className="text-green-400">Trending Up</Text>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <Text className="text-white/70 mb-2">Message Volume</Text>
            <div className="flex items-end justify-between">
              <Title className="text-white text-2xl">
                {Intl.NumberFormat('en').format(totalMessages)}
              </Title>
              <div className="text-green-400 text-sm">+12% vs last week</div>
            </div>
          </div>
          <div className="glass-card p-6">
            <Text className="text-white/70 mb-2">Average Response Time</Text>
            <div className="flex items-end justify-between">
              <Title className="text-white text-2xl">2.5 min</Title>
              <div className="text-green-400 text-sm">-30s vs last week</div>
            </div>
          </div>
          <div className="glass-card p-6">
            <Text className="text-white/70 mb-2">User Retention</Text>
            <div className="flex items-end justify-between">
              <Title className="text-white text-2xl">85%</Title>
              <div className="text-green-400 text-sm">+5% vs last week</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
