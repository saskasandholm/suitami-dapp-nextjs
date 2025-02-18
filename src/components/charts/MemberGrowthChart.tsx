import { AreaChart } from '@tremor/react';
import { motion } from 'framer-motion';
import { CalendarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import BaseChart, { InsightType } from './BaseChart';
import { formatValue } from '@/utils/formatters';
import type { EventProps } from '@tremor/react';

interface MemberData {
  date: string;
  total: number;
  active: number;
  new: number;
  [key: string]: string | number;
}

interface MemberGrowthChartProps {
  data: MemberData[];
  selectedRange: string;
  onHighlightChange?: (highlight: { key: string; value: any } | null) => void;
  highlightedData?: { key: string; value: any };
  chartId?: string;
}

// Define categories and their labels
const categories = ['total', 'active', 'new'] as const;
type Category = (typeof categories)[number];

// Define chart colors using Tremor's color system
const chartColors = {
  total: {
    color: 'cyan',
    stroke: '#06b6d4',
    fill: 'rgba(6, 182, 212, 0.2)',
    label: 'Total Members',
  },
  active: {
    color: 'emerald',
    stroke: '#10b981',
    fill: 'rgba(16, 185, 129, 0.2)',
    label: 'Active Members',
  },
  new: {
    color: 'violet',
    stroke: '#8b5cf6',
    fill: 'rgba(139, 92, 246, 0.2)',
    label: 'New Members',
  },
} as const;

// Add helper functions
const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const calculateActiveRatio = (active: number, total: number): number => {
  return Number(((active / total) * 100).toFixed(1));
};

export default function MemberGrowthChart({
  data,
  selectedRange,
  onHighlightChange,
  highlightedData,
  chartId = 'member-growth',
}: MemberGrowthChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Category[]>([]);
  const [highlightedPeriod, setHighlightedPeriod] = useState<'recent' | 'all' | null>(null);

  const visibleCategories = categories.filter(cat => !hiddenSeries.includes(cat));

  // Calculate growth metrics
  const metrics = useMemo(() => {
    const latest = data[data.length - 1];
    const earliest = data[0];
    const previousPeriod = data[Math.floor(data.length / 2)];

    return {
      total: Number((((latest.total - earliest.total) / earliest.total) * 100).toFixed(1)),
      active: Number((((latest.active - earliest.active) / earliest.active) * 100).toFixed(1)),
      new: latest.new,
      recentTrend:
        ((latest.total - previousPeriod.total) / (previousPeriod.total - earliest.total) - 1) * 100,
    } as const;
  }, [data]);

  // Generate insights
  const insights = useMemo(() => {
    const insights: InsightType[] = [];

    if (metrics.recentTrend > 10) {
      insights.push({
        text: `Growth is accelerating, with ${metrics.recentTrend.toFixed(1)}% faster growth in recent period`,
        priority: 'high',
        action: 'Consider scaling community resources',
        highlightData: { key: 'period', value: 'recent' },
      });
    } else if (metrics.recentTrend < -10) {
      insights.push({
        text: `Growth is slowing, with ${Math.abs(metrics.recentTrend).toFixed(1)}% slower growth in recent period`,
        priority: 'high',
        action: 'Review engagement strategies',
        highlightData: { key: 'period', value: 'recent' },
      });
    }

    const lastDataPoint = data[data.length - 1];
    const activeRatio = calculateActiveRatio(lastDataPoint.active, lastDataPoint.total);
    insights.push({
      text: `${activeRatio}% of total members are currently active`,
      priority: 'medium',
      action: activeRatio < 50 ? 'Consider engagement campaign' : undefined,
      highlightData: { key: 'category', value: 'active' },
    });

    if (metrics.new > 0) {
      insights.push({
        text: `${formatValue(metrics.new, 'members')} new members joined in this period`,
        priority: metrics.new > 100 ? 'medium' : 'low',
        highlightData: { key: 'category', value: 'new' },
      });
    }

    return insights;
  }, [data, metrics]);

  // Handle insight click
  const handleInsightClick = (insight: InsightType | null) => {
    if (insight?.highlightData) {
      setHighlightedPeriod(
        insight.highlightData.key === 'period' &&
          (insight.highlightData.value === 'recent' || insight.highlightData.value === 'all')
          ? insight.highlightData.value
          : null
      );
      onHighlightChange?.(insight.highlightData);
    } else {
      setHighlightedPeriod(null);
      onHighlightChange?.(null);
    }
  };

  // Handle legend click
  const handleLegendClick = (category: Category) => {
    setHiddenSeries(prev =>
      prev.includes(category) ? prev.filter(i => i !== category) : [...prev, category]
    );
  };

  // Current values for legend
  const currentValues = useMemo(() => {
    const latest = data[data.length - 1];
    return categories.map(cat => ({
      name: cat,
      label: chartColors[cat].label,
      value: latest[cat],
      color: chartColors[cat].color,
    }));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="h-full w-full flex flex-col"
    >
      <BaseChart
        title="Member Growth"
        subtitle="Track total, active, and new member trends"
        accessibilityLabel="Area chart showing member growth trends"
        rightContent={
          <div className="flex items-center space-x-2">
            <span className="mt-0.5 inline-flex rounded bg-emerald-100 px-1.5 py-0.5 text-tremor-label font-medium text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400">
              {metrics.total > 0 ? `+${metrics.total}%` : `${metrics.total}%`}
            </span>
          </div>
        }
        insights={insights}
        onInsightClick={handleInsightClick}
        chartId={chartId}
        highlightedData={highlightedData}
        className="h-full flex flex-col"
      >
        <div className="relative min-h-[300px] w-full">
          {/* Legend */}
          <div className="flex items-center gap-10 mb-4">
            {currentValues.map(category => (
              <div
                key={category.name}
                className="flex flex-col"
                onClick={() => handleLegendClick(category.name as Category)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-sm bg-${category.color}-500`}
                    aria-hidden={true}
                  />
                  <p className="text-tremor-label text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
                    {category.label}
                  </p>
                </div>
                <p className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {formatValue(category.value, 'members')}
                </p>
              </div>
            ))}
          </div>

          <AreaChart
            data={data}
            index="date"
            categories={visibleCategories}
            colors={visibleCategories.map(cat => chartColors[cat].color)}
            valueFormatter={value => formatValue(value, 'members')}
            showAnimation={true}
            showLegend={false}
            showGridLines={false}
            startEndOnly={true}
            showGradient={true}
            showXAxis={true}
            showYAxis={true}
            yAxisWidth={56}
            autoMinValue={true}
            className="h-[300px] [&_.recharts-curve]:!stroke-2 [&_.recharts-curve[name='total']]:!stroke-[#06b6d4] [&_.recharts-curve[name='active']]:!stroke-[#10b981] [&_.recharts-curve[name='new']]:!stroke-[#8b5cf6] [&_.recharts-area[name='total']]:!fill-[rgba(6,182,212,0.2)] [&_.recharts-area[name='active']]:!fill-[rgba(16,185,129,0.2)] [&_.recharts-area[name='new']]:!fill-[rgba(139,92,246,0.2)]"
            curveType="monotone"
          />

          {/* Highlight overlay */}
          {highlightedPeriod && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-cyan-500/10 
                          pointer-events-none transition-opacity duration-300"
            />
          )}
        </div>
      </BaseChart>
    </motion.div>
  );
}
