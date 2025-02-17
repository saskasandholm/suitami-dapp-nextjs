import { AreaChart } from '@tremor/react';
import { motion } from 'framer-motion';
import { CalendarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import BaseChart, { InsightType } from './BaseChart';
import { chartStyles } from '@/styles/chartStyles';
import CustomTooltip from '@/components/common/CustomTooltip';
import { formatValue } from '@/utils/formatters';
import type { EventProps } from '@tremor/react';

interface MemberData {
  date: string;
  total: number;
  active: number;
  new: number;
}

interface MemberGrowthChartProps {
  data: MemberData[];
  selectedRange: string;
  onHighlightChange?: (highlight: { key: string; value: any } | null) => void;
  highlightedData?: { key: string; value: any };
  chartId?: string;
}

interface EnrichedMemberData extends MemberData {
  enrichedValues: {
    [key: string]: {
      percentChange: number;
      benchmark: {
        type: 'average';
        value: number;
      };
      context: string;
    };
  };
}

// Add a helper function to calculate percentage change
const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Add a helper function to calculate active ratio
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
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const [highlightedPeriod, setHighlightedPeriod] = useState<'recent' | 'all' | null>(null);

  const categories = ['total', 'active', 'new'];
  const colors = ['cyan', 'emerald', 'violet'];

  // Calculate growth metrics with enhanced insights
  const metrics = useMemo(() => {
    const latest = data[data.length - 1];
    const earliest = data[0];
    const previousPeriod = data[Math.floor(data.length / 2)];

    const growth = {
      total: Number((((latest.total - earliest.total) / earliest.total) * 100).toFixed(1)),
      active: Number((((latest.active - earliest.active) / earliest.active) * 100).toFixed(1)),
      new: latest.new,
      recentTrend:
        ((latest.total - previousPeriod.total) / (previousPeriod.total - earliest.total) - 1) * 100,
    };

    return growth;
  }, [data]);

  // Generate enhanced insights based on the data
  const insights = useMemo(() => {
    const insights: InsightType[] = [];

    // Growth trend insight (High priority with action)
    if (metrics.recentTrend > 10) {
      insights.push({
        text: `Growth is accelerating, with ${metrics.recentTrend.toFixed(1)}% faster growth in recent period`,
        priority: 'high' as const,
        action: 'Consider scaling community resources',
        isExpandable: true,
        relatedData: {
          trend: metrics.recentTrend,
          currentGrowth: metrics.total,
          details: 'Click to see detailed growth breakdown',
        },
        highlightData: {
          key: 'period',
          value: 'recent',
        },
        relatedCharts: [
          {
            chartId: 'hourly-activity',
            insight: 'Check activity patterns during high-growth periods',
            chartType: 'bar',
            color: 'text-cyan-400',
          },
        ],
      });
    } else if (metrics.recentTrend < -10) {
      insights.push({
        text: `Growth is slowing, with ${Math.abs(metrics.recentTrend).toFixed(1)}% slower growth in recent period`,
        priority: 'high' as const,
        action: 'Review engagement strategies',
        isExpandable: true,
        relatedData: {
          trend: metrics.recentTrend,
          currentGrowth: metrics.total,
          details: 'Click to see potential factors',
        },
        highlightData: {
          key: 'period',
          value: 'recent',
        },
        relatedCharts: [
          {
            chartId: 'sentiment',
            insight: 'Check if sentiment trends correlate with slowing growth',
            chartType: 'sentiment',
            color: 'text-yellow-400',
          },
        ],
      });
    }

    // Active members insight (Medium priority)
    const lastDataPoint = data[data.length - 1];
    const activeRatio = calculateActiveRatio(lastDataPoint.active, lastDataPoint.total);
    insights.push({
      text: `${activeRatio}% of total members are currently active`,
      priority: 'medium' as const,
      action: activeRatio < 50 ? 'Consider engagement campaign' : undefined,
      isExpandable: true,
      relatedData: {
        activeRatio,
        totalMembers: lastDataPoint.total,
        activeMembers: lastDataPoint.active,
        details: 'Click to see activity trends',
        trend: activeRatio,
      },
      highlightData: {
        key: 'category',
        value: 'active',
      },
      relatedCharts: [
        {
          chartId: 'hourly-activity',
          insight: 'View hourly patterns of active members',
          chartType: 'bar',
          color: 'text-cyan-400',
        },
      ],
    });

    // New members insight (Medium/Low priority based on volume)
    if (metrics.new > 0) {
      insights.push({
        text: `${formatValue(metrics.new, 'members')} new members joined in this period`,
        priority: metrics.new > 100 ? ('medium' as const) : ('low' as const),
        isExpandable: true,
        relatedData: {
          newMembers: metrics.new,
          joinDates: 'Click to see join date distribution',
        },
        highlightData: {
          key: 'category',
          value: 'new',
        },
      });
    }

    return insights;
  }, [data, metrics]);

  // Handle insight click for drill-down and highlighting
  const handleInsightClick = (insight: InsightType | null) => {
    if (insight?.highlightData) {
      const value = insight.highlightData.value;
      setHighlightedPeriod(
        insight.highlightData.key === 'period' && (value === 'recent' || value === 'all')
          ? value
          : null
      );
      onHighlightChange?.(insight.highlightData);
    } else {
      setHighlightedPeriod(null);
      onHighlightChange?.(null);
    }
  };

  const handleLegendClick = (item: string) => {
    setHiddenSeries(prev => (prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]));
  };

  const visibleCategories = categories.filter(cat => !hiddenSeries.includes(cat));

  // Format categories for better readability
  const categoryLabels = {
    total: 'Total Members',
    active: 'Active Members',
    new: 'New Members',
  };

  // Use a stable timestamp for lastUpdated
  const lastUpdated = useMemo(() => new Date(data[data.length - 1].date), [data]);

  // Update chart styles based on highlighted data
  const getAreaStyles = (category: string) => {
    if (highlightedData?.key === 'category' && highlightedData.value === category) {
      return 'opacity-100 !stroke-[3px] !stroke-accent/80 !fill-accent/20 scale-[1.02] transform-gpu';
    }
    if (highlightedData?.key === 'category' && highlightedData.value !== category) {
      return 'opacity-20 saturate-[0.5]';
    }
    return '';
  };

  // Calculate the date range for highlighting periods
  const getHighlightedRange = () => {
    if (highlightedPeriod === 'recent') {
      const midPoint = Math.floor(data.length / 2);
      return {
        start: data[midPoint].date,
        end: data[data.length - 1].date,
      };
    }
    return null;
  };

  // Add highlight transition styles
  const highlightTransitionStyles = 'transition-all duration-300 ease-in-out';

  // Calculate enriched data for tooltips
  const enrichedData = useMemo(() => {
    return data.map((point, index) => {
      const previousPoint = index > 0 ? data[index - 1] : null;
      const avgTotal = data.reduce((sum, d) => sum + d.total, 0) / data.length;
      const avgActive = data.reduce((sum, d) => sum + d.active, 0) / data.length;
      const avgNew = data.reduce((sum, d) => sum + d.new, 0) / data.length;

      return {
        ...point,
        enrichedValues: {
          total: {
            percentChange: previousPoint
              ? calculatePercentChange(point.total, previousPoint.total)
              : 0,
            benchmark: { type: 'average' as const, value: avgTotal },
            context: `${point.total > avgTotal ? 'Above' : 'Below'} average by ${Math.abs(((point.total - avgTotal) / avgTotal) * 100).toFixed(1)}%`,
          },
          active: {
            percentChange: previousPoint
              ? calculatePercentChange(point.active, previousPoint.active)
              : 0,
            benchmark: { type: 'average' as const, value: avgActive },
            context: `${((point.active / point.total) * 100).toFixed(1)}% of total members are active`,
          },
          new: {
            percentChange: previousPoint ? calculatePercentChange(point.new, previousPoint.new) : 0,
            benchmark: { type: 'average' as const, value: avgNew },
            context: point.new > avgNew ? 'Above average new members' : 'Below average new members',
          },
        },
      };
    });
  }, [data]) as EnrichedMemberData[];

  // Custom formatter for chart values that also attaches enriched data
  const formatChartValue = (value: number, category?: string) => {
    if (!category) return formatValue(value, 'members');
    const point = enrichedData.find(d => d[category as keyof MemberData] === value);
    if (!point) return formatValue(value, 'members');

    const enrichedValue = point.enrichedValues[category];
    // Attach enriched data to the DOM element for the tooltip to use
    const element = document.querySelector(`[data-value="${value}"]`);
    if (element) {
      element.setAttribute(
        'data-enriched',
        JSON.stringify({
          percentChange: enrichedValue.percentChange,
          benchmark: enrichedValue.benchmark,
          context: enrichedValue.context,
        })
      );
    }
    return formatValue(value, 'members');
  };

  return (
    <BaseChart
      title="Community Growth Trends"
      subtitle={`${formatValue(data[data.length - 1].total, 'members')} total members • ${metrics.total}% overall growth`}
      accessibilityLabel="Member growth chart showing total, active, and new members over time"
      rightContent={
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-2 text-white/70"
            role="status"
            aria-label="Selected time range"
          >
            <CalendarIcon className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm">{selectedRange}</span>
          </div>
          {metrics.total && Number(metrics.total) > 0 && (
            <div
              className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm"
              role="status"
              aria-label={`Growth rate: ${metrics.total}%`}
            >
              <ArrowTrendingUpIcon className="w-4 h-4" aria-hidden="true" />
              <span>+{metrics.total}% Growth</span>
            </div>
          )}
        </div>
      }
      insights={insights}
      onInsightClick={handleInsightClick}
      lastUpdated={lastUpdated}
      chartId={chartId}
      highlightedData={highlightedData}
    >
      <div role="region" aria-label="Member growth chart" className="space-y-6">
        {/* Key metrics summary */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(metrics)
            .filter(([key]) => key !== 'recentTrend')
            .map(([key, value]) => (
              <div
                key={key}
                className={`p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${
                  highlightedData?.key === 'category' && highlightedData.value === key
                    ? 'ring-2 ring-accent/50'
                    : ''
                }`}
              >
                <div className="text-sm text-white/70">
                  {categoryLabels[key as keyof typeof categoryLabels]}
                </div>
                <div className="text-lg font-medium text-white">
                  {formatValue(
                    Number(value),
                    key === 'total' ? 'members' : key === 'active' ? 'members' : 'growth'
                  )}
                </div>
                {key !== 'new' && (
                  <div className="text-sm text-white/50 mt-1">vs. previous period</div>
                )}
              </div>
            ))}
        </div>

        {/* Main chart */}
        <div className="relative">
          {highlightedPeriod === 'recent' && (
            <div
              className="absolute inset-0 bg-gradient-to-l from-accent/10 via-accent/5 to-transparent pointer-events-none z-10 transition-opacity duration-300"
              style={{
                clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
              }}
            />
          )}
          <AreaChart
            data={enrichedData}
            index="date"
            categories={visibleCategories}
            colors={colors}
            showLegend={true}
            showGridLines={true}
            startEndOnly={false}
            showAnimation={hiddenSeries.length === 0}
            className={`${chartStyles.areaChart.className} ${highlightTransitionStyles} ${
              highlightedData?.key === 'category' || highlightedPeriod
                ? '[&_.tremor-AreaChart-path]:transition-all [&_.tremor-AreaChart-path]:duration-300 [&_.tremor-AreaChart-path]:ease-in-out'
                : ''
            }`}
            valueFormatter={formatChartValue}
            onValueChange={v => {
              setSelectedPoint(v ? String(v.date) : null);
              if (!v) {
                setHighlightedPeriod(null);
                onHighlightChange?.(null);
              }
            }}
            customTooltip={CustomTooltip}
            yAxisWidth={56}
            enableLegendSlider={false}
            noDataText="No data available"
            showYAxis={true}
            showXAxis={true}
            curveType="monotone"
            minValue={0}
            aria-label="Interactive area chart showing member growth trends"
          />
        </div>
      </div>
    </BaseChart>
  );
}
