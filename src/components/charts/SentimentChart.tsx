import { AreaChart, Text, EventProps } from '@tremor/react';
import { motion } from 'framer-motion';
import {
  FaceSmileIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { useState, useMemo, useEffect } from 'react';
import BaseChart from './BaseChart';
import { chartStyles } from '@/styles/chartStyles';
import CustomTooltip from '@/components/common/CustomTooltip';
import { formatValue, formatDate } from '@/utils/formatters';
import { getColorClassName } from '@/utils/chartUtils';
import {
  SentimentData,
  BaseSentimentChartProps,
  SENTIMENT_COLORS,
  SENTIMENT_COLOR_CLASSES,
  calculateSentimentMetrics,
  generateSentimentInsights,
  SentimentTrend,
} from '@/types/sentiment';

interface SentimentChartProps extends BaseSentimentChartProps {
  data: SentimentData[];
  selectedRange?: string;
}

// Define CSS custom properties
const cssVariables = {
  '--positive-fill': `var(--${getColorClassName('emerald', 'fill')}/40)`,
  '--positive-stroke': `var(--${getColorClassName('emerald', 'stroke')})`,
  '--positive-text': `var(--${getColorClassName('emerald', 'text')})`,
  '--neutral-fill': `var(--${getColorClassName('slate', 'fill')}/40)`,
  '--neutral-stroke': `var(--${getColorClassName('slate', 'stroke')})`,
  '--neutral-text': `var(--${getColorClassName('slate', 'text')})`,
  '--negative-fill': `var(--${getColorClassName('rose', 'fill')}/40)`,
  '--negative-stroke': `var(--${getColorClassName('rose', 'stroke')})`,
  '--negative-text': `var(--${getColorClassName('rose', 'text')})`,
} as Record<`--${string}`, string>;

// Define chart categories and colors
const chartCategories = ['positive', 'neutral', 'negative'] as const;
const chartColors = [...SENTIMENT_COLORS] as string[];

export default function SentimentChart({
  data,
  title = 'Community Sentiment Trends',
  subtitle = 'Track distribution of community sentiment over time',
  onHighlightChange,
  highlightedData,
  chartId = 'sentiment-trends',
  selectedRange = '7d',
}: SentimentChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Calculate metrics and insights
  const metrics = useMemo(() => calculateSentimentMetrics(data), [data]);
  const insights = useMemo(
    () => generateSentimentInsights(metrics, selectedRange),
    [metrics, selectedRange]
  );

  // Format data with unique dates for the chart
  const formattedData = useMemo(() => {
    const transformed = data.map((item, index) => {
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return {
        ...item,
        id: `${date.getTime()}-${index}`, // Unique identifier using timestamp and index
        displayDate: formattedDate, // Formatted date for display
        date: item.date, // Keep original date for calculations
      };
    });

    // Debug logging
    console.group('SentimentChart Data Transformation');
    console.log('Original data:', data);
    console.log('Transformed data:', transformed);
    console.log(
      'Unique IDs:',
      transformed.map(d => d.id)
    );
    console.log('Checking for duplicate IDs...');
    const ids = transformed.map(d => d.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      console.warn('Found duplicate IDs:', duplicateIds);
    } else {
      console.log('No duplicate IDs found');
    }
    console.groupEnd();

    return transformed;
  }, [data]);

  // Additional verification for chart props
  useEffect(() => {
    console.group('SentimentChart Props Verification');
    console.log('Chart index prop:', 'id');
    console.log('Categories:', Array.from(chartCategories));
    console.log('Data sample:', formattedData[0]);
    console.groupEnd();
  }, [formattedData]);

  // Format value for tooltip and axis labels
  const formatValue = (value: number) => `${value.toFixed(1)}%`;

  // Custom tick formatter for X-axis
  const formatXAxisTick = (value: string) => {
    const dataPoint = formattedData.find(d => d.id === value);
    return dataPoint?.displayDate || value;
  };

  // Calculate trend metrics for UI
  const trendMetrics = useMemo(() => {
    const TrendIcon =
      metrics.trend === 'up'
        ? ArrowTrendingUpIcon
        : metrics.trend === 'down'
          ? ArrowTrendingDownIcon
          : MinusIcon;

    const trendColor =
      metrics.trend === 'up'
        ? 'text-emerald-400'
        : metrics.trend === 'down'
          ? 'text-rose-400'
          : 'text-white/50';

    const trendBg =
      metrics.trend === 'up'
        ? 'bg-emerald-400/10'
        : metrics.trend === 'down'
          ? 'bg-rose-400/10'
          : 'bg-white/10';

    return {
      TrendIcon,
      trendColor,
      trendBg,
      avgPositive: metrics.avgPositive,
      scoreChange: metrics.scoreChange.toFixed(1),
    };
  }, [metrics]);

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
        accessibilityLabel={`${title} chart showing sentiment distribution over time`}
        rightContent={
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-accent/10">
              <FaceSmileIcon className="w-4 h-4 text-accent" />
              <Text className="text-sm text-accent">
                Avg Positive: {formatValue(trendMetrics.avgPositive)}
              </Text>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${trendMetrics.trendBg}`}
            >
              <trendMetrics.TrendIcon className={`w-4 h-4 ${trendMetrics.trendColor}`} />
              <Text className={`text-sm ${trendMetrics.trendColor}`}>
                {trendMetrics.scoreChange}%
              </Text>
            </motion.div>
          </motion.div>
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
        <div className="relative min-h-[300px] w-full">
          <AreaChart
            className={`${chartStyles.areaChart.className} h-[300px] transition-opacity duration-200`}
            data={formattedData}
            index="id"
            categories={Array.from(chartCategories)}
            colors={chartColors}
            valueFormatter={value => formatValue(value)}
            showAnimation={true}
            stack={true}
            curveType="monotone"
            customTooltip={(props: any) => {
              const dataPoint = formattedData.find(d => d.id === props.activePoint?.x);
              if (!dataPoint) return null;
              return CustomTooltip({
                ...props,
                activePoint: {
                  ...props.activePoint,
                  x: dataPoint.displayDate,
                  id: dataPoint.id,
                },
              });
            }}
            showGridLines={false}
            minValue={0}
            maxValue={100}
            startEndOnly={false}
            showLegend={true}
            onValueChange={(v: EventProps | null) => {
              setHoveredPoint(v ? String(v.id) : null);
            }}
            showXAxis={true}
            showYAxis={true}
            yAxisWidth={56}
            enableLegendSlider={false}
            noDataText="No data available"
            rotateLabelX={{ angle: -45, verticalShift: 10 }}
            autoMinValue={true}
            allowDecimals={false}
          />
          {/* Enhanced hover effect with trend indicator */}
          <div
            className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
              hoveredPoint
                ? `${trendMetrics.trendBg} border border-${trendMetrics.trendColor}/20`
                : 'bg-accent/0 group-hover:bg-accent/[0.01] border border-transparent'
            } rounded-lg`}
          />
          {/* Trend line */}
          {metrics.trend !== 'stable' && (
            <div
              className={`absolute bottom-0 left-0 w-full h-0.5 ${
                metrics.trend === 'up'
                  ? 'bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/40'
                  : 'bg-gradient-to-r from-rose-400/0 via-rose-400/20 to-rose-400/40'
              } transform ${
                metrics.trend === 'up' ? '-rotate-1' : 'rotate-1'
              } transition-opacity duration-300 ${
                hoveredPoint ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
              }`}
            />
          )}
        </div>
      </BaseChart>
    </motion.div>
  );
}
