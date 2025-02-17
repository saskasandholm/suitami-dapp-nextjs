import { InsightType } from '@/components/charts/BaseChart';
import { chartColors, type AvailableChartColorsKeys, getColorClassName } from '@/utils/chartUtils';

export interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface CurrentSentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export type SentimentTrend = 'up' | 'down' | 'stable';

export interface BaseSentimentChartProps {
  title?: string;
  subtitle?: string;
  onHighlightChange?: (highlight: { key: string; value: any } | null) => void;
  highlightedData?: { key: string; value: any };
  chartId?: string;
}

export interface SentimentMetrics {
  avgPositive: number;
  scoreChange: number;
  trend: SentimentTrend;
  distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

// Use Tremor's chartColors for sentiment categories
export const SENTIMENT_COLORS: AvailableChartColorsKeys[] = ['emerald', 'slate', 'rose'];

// Use Tremor's getColorClassName for consistent color classes
export const SENTIMENT_COLOR_CLASSES = {
  positive: getColorClassName('emerald', 'text'),
  neutral: getColorClassName('slate', 'text'),
  negative: getColorClassName('rose', 'text'),
} as const;

// Utility functions for sentiment analysis
export const calculateSentimentMetrics = (data: SentimentData[]): SentimentMetrics => {
  const latest = data[data.length - 1];
  const earliest = data[0];

  // Calculate average positive sentiment
  const avgPositive = data.reduce((sum, d) => sum + d.positive, 0) / data.length;

  // Calculate score change
  const scoreChange =
    data.length > 1 ? ((latest.positive - earliest.positive) / earliest.positive) * 100 : 0;

  // Determine trend
  const trend: SentimentTrend = scoreChange > 5 ? 'up' : scoreChange < -5 ? 'down' : 'stable';

  return {
    avgPositive,
    scoreChange,
    trend,
    distribution: {
      positive: latest.positive,
      neutral: latest.neutral,
      negative: latest.negative,
    },
  };
};

export const generateSentimentInsights = (
  metrics: SentimentMetrics,
  timeRange: string
): InsightType[] => {
  const insights: InsightType[] = [];

  // Trend insight
  if (metrics.trend !== 'stable') {
    insights.push({
      text: `Sentiment is ${metrics.trend === 'up' ? 'improving' : 'declining'}, with ${Math.abs(metrics.scoreChange).toFixed(1)}% ${metrics.trend === 'up' ? 'increase' : 'decrease'} in positive sentiment`,
      priority: metrics.trend === 'up' ? 'medium' : 'high',
      action: metrics.trend === 'down' ? 'Review recent community feedback' : undefined,
      highlightData: {
        key: 'trend',
        value: metrics.trend,
      },
    });
  }

  // Distribution insight
  const total =
    metrics.distribution.positive + metrics.distribution.neutral + metrics.distribution.negative;
  const positiveRatio = (metrics.distribution.positive / total) * 100;

  if (positiveRatio < 50) {
    insights.push({
      text: `Only ${positiveRatio.toFixed(1)}% positive sentiment in the last ${timeRange}`,
      priority: 'high',
      action: 'Consider community engagement initiatives',
      highlightData: {
        key: 'category',
        value: 'positive',
      },
    });
  } else if (positiveRatio > 75) {
    insights.push({
      text: `Strong positive sentiment at ${positiveRatio.toFixed(1)}%`,
      priority: 'low',
      highlightData: {
        key: 'category',
        value: 'positive',
      },
    });
  }

  return insights;
};
