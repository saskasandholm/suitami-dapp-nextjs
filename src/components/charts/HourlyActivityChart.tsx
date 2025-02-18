import { BarChart } from '@tremor/react';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import BaseChart, { InsightType, HighlightedData } from './BaseChart';
import CustomTooltip from '@/components/common/CustomTooltip';
import { formatValue } from '@/utils/formatters';
import type { EventProps } from '@tremor/react';
import styles from './HourlyActivityChart.module.css';

interface HourlyActivityData {
  hour: string;
  messages: number;
  reactions: number;
  threads: number;
}

interface HourlyActivityChartProps {
  data: HourlyActivityData[];
  selectedDate: string;
  onHighlightChange?: (highlight: HighlightedData) => void;
  highlightedData?: HighlightedData;
  chartId?: string;
}

// Define colors using Tremor's color system with our custom theme colors
const chartColors = {
  messages: { color: 'cyan', value: 'var(--chart-messages)' },
  reactions: { color: 'emerald', value: 'var(--chart-reactions)' },
  threads: { color: 'violet', value: 'var(--chart-threads)' },
} as const;

type ChartCategory = keyof typeof chartColors;
const chartCategories: ChartCategory[] = ['messages', 'reactions', 'threads'];

const categoryLabels: Record<ChartCategory, string> = {
  messages: 'Messages',
  reactions: 'Reactions',
  threads: 'Threads',
};

export default function HourlyActivityChart({
  data,
  selectedDate,
  onHighlightChange,
  highlightedData,
  chartId = 'hourly-activity',
}: HourlyActivityChartProps) {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const [highlightedHour, setHighlightedHour] = useState<string | null>(null);

  const colors = chartCategories.map(cat => chartColors[cat].color);

  // Calculate peak hours and activity metrics with enhanced insights
  const metrics = useMemo(() => {
    const totals = data.reduce(
      (acc, hour) => ({
        messages: acc.messages + hour.messages,
        reactions: acc.reactions + hour.reactions,
        threads: acc.threads + hour.threads,
      }),
      { messages: 0, reactions: 0, threads: 0 }
    );

    const hourlyTotals = data.map(hour => ({
      hour: hour.hour,
      total: hour.messages + hour.reactions + hour.threads,
    }));

    const peakHour = hourlyTotals.reduce(
      (peak, curr) => (curr.total > peak.total ? curr : peak),
      hourlyTotals[0]
    );

    const quietHour = hourlyTotals.reduce(
      (quiet, curr) => (curr.total < quiet.total ? curr : quiet),
      hourlyTotals[0]
    );

    const avgActivity =
      hourlyTotals.reduce((sum, curr) => sum + curr.total, 0) / hourlyTotals.length;

    return { totals, peakHour, quietHour, avgActivity };
  }, [data]);

  const totalActivity = useMemo(
    () => metrics.totals.messages + metrics.totals.reactions + metrics.totals.threads,
    [metrics.totals]
  );

  // Generate enhanced insights based on the data
  const insights = useMemo(() => {
    const insights: InsightType[] = [];

    // Peak activity insight (High priority with action)
    insights.push({
      text: `Peak activity at ${metrics.peakHour.hour}:00 with ${formatValue(metrics.peakHour.total, 'activity')} interactions`,
      priority: 'high' as const,
      action: 'Consider scheduling key announcements around this time',
      isExpandable: true,
      relatedData: {
        hour: metrics.peakHour.hour,
        total: metrics.peakHour.total,
        breakdown: 'Click to see activity breakdown',
      },
      highlightData: {
        key: 'hour',
        value: metrics.peakHour.hour,
      },
      relatedCharts: [
        {
          chartId: 'member-growth',
          insight: 'Check if peak activity times correlate with member growth',
        },
      ],
    });

    // Activity distribution insight (Medium priority)
    const mostActive = Object.entries(metrics.totals).sort(([, a], [, b]) => b - a)[0];
    insights.push({
      text: `${categoryLabels[mostActive[0] as keyof typeof categoryLabels]} are the most common interaction (${((mostActive[1] / totalActivity) * 100).toFixed(1)}%)`,
      priority: 'medium' as const,
      isExpandable: true,
      relatedData: {
        type: mostActive[0],
        count: Number(mostActive[1]),
        percentage: String(((mostActive[1] / totalActivity) * 100).toFixed(1)),
        details: 'Click to see historical trends',
      },
      highlightData: {
        key: 'category',
        value: mostActive[0],
      },
      relatedCharts: [
        {
          chartId: 'sentiment',
          insight: 'Compare interaction types with sentiment trends',
        },
      ],
    });

    // Quiet hours insight (Medium priority with action if very low)
    const quietHourActivity = metrics.quietHour.total;
    const avgHourlyActivity = metrics.avgActivity;
    const isVeryQuiet = quietHourActivity < avgHourlyActivity * 0.2;

    insights.push({
      text: `Lowest activity at ${metrics.quietHour.hour}:00 with ${formatValue(metrics.quietHour.total, 'activity')} interactions`,
      priority: isVeryQuiet ? ('medium' as const) : ('low' as const),
      action: isVeryQuiet
        ? 'Consider strategies to maintain engagement during quiet hours'
        : undefined,
      isExpandable: true,
      relatedData: {
        hour: metrics.quietHour.hour,
        total: metrics.quietHour.total,
        avgActivity: metrics.avgActivity,
        details: 'Click to see quiet hours pattern',
      },
      highlightData: {
        key: 'hour',
        value: metrics.quietHour.hour,
      },
    });

    return insights;
  }, [metrics, totalActivity, categoryLabels]);

  // Handle insight click for drill-down and highlighting
  const handleInsightClick = (insight: InsightType | null) => {
    if (insight?.highlightData) {
      const hourValue =
        insight.highlightData.key === 'hour' ? String(insight.highlightData.value) : null;
      setHighlightedHour(hourValue);
      onHighlightChange?.({
        key: insight.highlightData.key,
        value: String(insight.highlightData.value),
      });
    } else {
      setHighlightedHour(null);
      onHighlightChange?.({
        key: '',
        value: '',
      });
    }
  };

  const handleLegendClick = (item: string) => {
    setHiddenSeries(prev => (prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]));
  };

  const visibleCategories = chartCategories.filter(cat => !hiddenSeries.includes(cat));

  // Calculate percentages for each category
  const percentages = useMemo(() => {
    const total = totalActivity;
    return {
      messages: ((metrics.totals.messages / total) * 100).toFixed(1),
      reactions: ((metrics.totals.reactions / total) * 100).toFixed(1),
      threads: ((metrics.totals.threads / total) * 100).toFixed(1),
    };
  }, [metrics.totals, totalActivity]);

  // Use selectedDate for lastUpdated
  const lastUpdated = useMemo(() => {
    const [month, day, year] = selectedDate.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }, [selectedDate]);

  // Update chart styles based on highlighted data
  const getBarStyles = (hour: string) => {
    if (highlightedData?.key === 'hour' && highlightedData.value === hour) {
      return 'opacity-100 scale-110 !fill-accent/40 !stroke-accent/80 !stroke-[2px] shadow-lg shadow-accent/20 transform-gpu';
    }
    if (highlightedHour === hour) {
      return 'opacity-100 scale-110 !fill-accent/40 !stroke-accent/80 !stroke-[2px] shadow-lg shadow-accent/20 transform-gpu';
    }
    if (highlightedHour && highlightedHour !== hour) {
      return 'opacity-20 saturate-[0.5]';
    }
    return '';
  };

  // Add highlight transition styles
  const highlightTransitionStyles = 'transition-all duration-300 ease-in-out';

  const handleValueChange = (value: EventProps) => {
    if (!value) {
      setSelectedBar(null);
      setHighlightedHour(null);
      onHighlightChange?.({
        key: '',
        value: '',
      });
      return;
    }

    const hourValue = String(value.hour);
    setSelectedBar(hourValue);
    setHighlightedHour(hourValue);
    onHighlightChange?.({
      key: 'hour',
      value: hourValue,
    });
  };

  const transformedData = useMemo(
    () =>
      data.map(item => ({
        ...item,
        hour: String(item.hour),
      })),
    [data]
  );

  return (
    <BaseChart
      title="Hourly Engagement Patterns"
      subtitle={`${formatValue(totalActivity, 'activity')} total interactions • Peak: ${metrics.peakHour.hour}:00`}
      accessibilityLabel="Hourly activity distribution showing messages, reactions, and threads"
      rightContent={
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-2 text-white/70"
            role="status"
            aria-label="Selected date"
          >
            <ClockIcon className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm">{selectedDate}</span>
          </div>
          <div
            className={`px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm`}
            role="status"
            aria-label={`Average hourly activity: ${formatValue(metrics.avgActivity, 'activity')}`}
          >
            ~{formatValue(metrics.avgActivity, 'activity')}/hour
          </div>
        </div>
      }
      insights={insights}
      onInsightClick={handleInsightClick}
      lastUpdated={lastUpdated}
      chartId={chartId}
      highlightedData={highlightedData}
    >
      <div role="region" aria-label="Hourly activity chart" className="space-y-6">
        {/* Activity distribution summary */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(metrics.totals).map(([key, value]) => (
            <div
              key={key}
              className={`p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${
                highlightedData?.key === 'category' && highlightedData.value === key
                  ? 'ring-2 ring-accent/50'
                  : ''
              }`}
              style={
                {
                  '--highlight-color': chartColors[key as ChartCategory].value,
                } as React.CSSProperties
              }
            >
              <div className="text-sm text-white/70">
                {categoryLabels[key as keyof typeof categoryLabels]}
              </div>
              <div className="text-lg font-medium text-white">{formatValue(value, 'activity')}</div>
              <div className="text-sm text-white/50 mt-1">
                {((value / totalActivity) * 100).toFixed(1)}% of total
              </div>
            </div>
          ))}
        </div>

        {/* Main chart */}
        <div className={styles.chartContainer}>
          <BarChart
            data={transformedData}
            index="hour"
            categories={visibleCategories}
            colors={colors}
            showLegend={true}
            showGridLines={true}
            startEndOnly={false}
            showAnimation={hiddenSeries.length === 0}
            className={`${highlightTransitionStyles} ${
              highlightedHour || highlightedData?.key === 'hour'
                ? '[&_.tremor-BarChart-bar]:transition-all [&_.tremor-BarChart-bar]:duration-300 [&_.tremor-BarChart-bar]:ease-in-out'
                : ''
            }`}
            valueFormatter={value => formatValue(value, 'activity')}
            onValueChange={handleValueChange}
            customTooltip={CustomTooltip}
            yAxisWidth={56}
            enableLegendSlider={false}
            noDataText="No data available"
            showYAxis={true}
            showXAxis={true}
            minValue={0}
            aria-label="Interactive bar chart showing hourly activity distribution"
          />

          {/* Peak hour indicator */}
          {metrics.peakHour && (
            <div
              className={styles.peakHourIndicator}
              style={{
                left: `${(Number(metrics.peakHour.hour) / 24) * 100}%`,
                width: '4.16%', // 1/24th of the width
              }}
              aria-label={`Peak activity hour at ${metrics.peakHour.hour}:00`}
            />
          )}
        </div>
      </div>
    </BaseChart>
  );
}
