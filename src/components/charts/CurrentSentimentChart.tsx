import { DonutChart, Text } from '@tremor/react';
import { motion } from 'framer-motion';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import BaseChart from './BaseChart';
import { chartStyles } from '@/styles/chartStyles';
import { formatValue } from '@/utils/formatters';
import { getColorClassName } from '@/utils/chartUtils';
import {
  CurrentSentimentData,
  BaseSentimentChartProps,
  SENTIMENT_COLORS,
  SENTIMENT_COLOR_CLASSES,
  generateSentimentInsights,
  SentimentMetrics,
} from '@/types/sentiment';

interface CurrentSentimentChartProps extends BaseSentimentChartProps {
  data: CurrentSentimentData;
}

// Define CSS custom properties
const cssVariables = {
  '--positive-fill': `var(--${getColorClassName('emerald', 'fill')})`,
  '--positive-text': `var(--${getColorClassName('emerald', 'text')})`,
  '--neutral-fill': `var(--${getColorClassName('slate', 'fill')})`,
  '--neutral-text': `var(--${getColorClassName('slate', 'text')})`,
  '--negative-fill': `var(--${getColorClassName('rose', 'fill')})`,
  '--negative-text': `var(--${getColorClassName('rose', 'text')})`,
} as Record<`--${string}`, string>;

// Define chart categories and colors
const chartCategories = ['positive', 'neutral', 'negative'] as const;
const chartColors = [...SENTIMENT_COLORS] as string[];

export default function CurrentSentimentChart({
  data,
  title = 'Current Sentiment Distribution',
  subtitle = 'Distribution of current community sentiment',
  onHighlightChange,
  highlightedData,
  chartId = 'current-sentiment',
}: CurrentSentimentChartProps) {
  // Calculate metrics for insights
  const metrics: SentimentMetrics = {
    avgPositive: data.positive,
    scoreChange: 0, // Not applicable for current distribution
    trend: 'stable',
    distribution: data,
  };

  // Generate insights
  const insights = generateSentimentInsights(metrics, 'current');

  // Calculate percentages
  const total = data.positive + data.neutral + data.negative;
  const positivePercentage = ((data.positive / total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="h-full w-full flex flex-col"
      style={cssVariables}
    >
      <BaseChart
        title={title}
        subtitle={subtitle}
        accessibilityLabel="Donut chart showing current sentiment distribution"
        rightContent={
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-400/10">
            <FaceSmileIcon className="w-4 h-4 text-emerald-400" />
            <Text className="text-sm text-emerald-400">{positivePercentage}% Positive</Text>
          </div>
        }
        insights={insights}
        onInsightClick={insight => {
          if (insight?.highlightData) {
            onHighlightChange?.(insight.highlightData);
          } else {
            onHighlightChange?.(null);
          }
        }}
        chartId={chartId}
        highlightedData={highlightedData}
        className="h-full flex flex-col"
      >
        <div className="relative min-h-[300px] w-full flex items-center justify-center">
          <DonutChart
            className={`${chartStyles.donutChart.className} h-[240px] w-[240px]`}
            data={[
              { name: 'positive', value: data.positive },
              { name: 'neutral', value: data.neutral },
              { name: 'negative', value: data.negative },
            ]}
            category="value"
            index="name"
            colors={chartColors}
            valueFormatter={value => formatValue(value, 'percent')}
            showAnimation={true}
            showLabel={false}
          />
        </div>
      </BaseChart>
    </motion.div>
  );
}
