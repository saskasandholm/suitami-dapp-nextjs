import { ReactNode, useState, useCallback } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  ChartBarSquareIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

type InsightPriority = 'high' | 'medium' | 'low';

export interface InsightType {
  text: string;
  priority?: InsightPriority;
  action?: string;
  isExpandable?: boolean;
  relatedData?: Record<string, any>;
  highlightData?: {
    key: string;
    value: any;
  };
  relatedCharts?: Array<{
    chartId: string;
    insight?: string;
    chartType?: ChartType;
    color?: string;
  }>;
}

interface BaseChartProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  accessibilityLabel: string;
  rightContent?: ReactNode;
  lastUpdated?: Date;
  insights?: InsightType[];
  onInsightClick?: (insight: InsightType | null) => void;
  chartId?: string;
  highlightedData?: {
    key: string;
    value: any;
  };
}

// Add a type for chart types
type ChartType = 'bar' | 'area' | 'donut' | 'sentiment' | 'engagement' | 'members';

interface RelatedChartReference {
  chartId: string;
  insight: string;
  chartType?: ChartType;
  color?: string;
}

// Add a map for chart type icons
const chartTypeIcons = {
  bar: ChartBarIcon,
  area: ChartBarSquareIcon,
  donut: ChartPieIcon,
  sentiment: ChatBubbleLeftRightIcon,
  engagement: HeartIcon,
  members: UserGroupIcon
};

// Add a map for chart type colors
const chartTypeColors = {
  bar: 'text-cyan-400',
  area: 'text-emerald-400',
  donut: 'text-violet-400',
  sentiment: 'text-yellow-400',
  engagement: 'text-pink-400',
  members: 'text-blue-400'
};

// Update the RelatedChartLink component
const RelatedChartLink = ({ chartRef, onClick }: { 
  chartRef: RelatedChartReference; 
  onClick: () => void;
}) => {
  const Icon = chartRef.chartType ? chartTypeIcons[chartRef.chartType] : ArrowTopRightOnSquareIcon;
  const colorClass = chartRef.color || (chartRef.chartType ? chartTypeColors[chartRef.chartType] : 'text-accent');

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex items-start space-x-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 w-full"
      role="link"
      aria-label={`View related chart: ${chartRef.insight}`}
    >
      <Icon className={`w-4 h-4 ${colorClass} group-hover:scale-110 transition-transform mt-0.5`} />
      <div className="flex flex-col items-start">
        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
          See also:
        </span>
        <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
          {chartRef.insight}
        </span>
      </div>
      <motion.div 
        className="ml-auto"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
      >
        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
      </motion.div>
    </motion.button>
  );
};

// Helper function to format dates consistently
const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const chartStyles = {
  areaChart: {
    gradient: {
      from: 'rgba(135, 250, 253, 0.15)',
      to: 'rgba(135, 250, 253, 0.01)',
    },
    line: {
      stroke: '#87fafd',
      strokeWidth: 2,
    },
    className: `
      [&_.tremor-AreaChart-path]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]
      [&_.tremor-Legend]:!mt-6 
      [&_.tremor-Legend]:!justify-start 
      [&_.tremor-Legend]:!overflow-x-auto 
      [&_.tremor-Legend-list]:!flex-wrap 
      [&_.tremor-Legend-list]:!gap-4 
      [&_.tremor-Legend]:antialiased 
      [&_text]:fill-white/70 
      [&_line]:stroke-white/5
      [&_line]:stroke-dasharray-2
      [&_.tremor-AreaChart]:!h-[300px]
      [&_.tremor-AreaChart-line]:!stroke-2
      [&_.tremor-AreaChart-area]:!opacity-15
      [&_.tremor-AreaChart-path]:!transition-all
      [&_.tremor-AreaChart-path]:hover:!opacity-100
      [&_.tremor-AreaChart-line]:hover:!stroke-[3px]
      [&_.tremor-AreaChart-dot]:!r-[3]
      [&_.tremor-AreaChart-dot]:!opacity-0
      [&_.tremor-AreaChart-dot]:!fill-current
      [&_.tremor-AreaChart-dot]:!transition-all
      [&_.tremor-AreaChart-dot]:hover:!r-[5]
      [&_.tremor-AreaChart-dot]:hover:!opacity-100
      [&_.tremor-AreaChart-dot]:focus:!r-[5]
      [&_.tremor-AreaChart-dot]:focus:!opacity-100
      [&_.tremor-AreaChart-dot]:focus:!outline-none
      [&_.tremor-AreaChart-dot]:focus:!ring-2
      [&_.tremor-AreaChart-dot]:focus:!ring-accent
      [&_.tremor-AreaChart-dot]:focus:!ring-offset-2
      [&_.tremor-AreaChart-dot][aria-selected=true]:!r-[5]
      [&_.tremor-AreaChart-dot][aria-selected=true]:!opacity-100
      [&_.tremor-Legend-item]:!px-3
      [&_.tremor-Legend-item]:!py-1.5
      [&_.tremor-Legend-item]:!rounded-lg
      [&_.tremor-Legend-item]:!bg-white/5
      [&_.tremor-Legend-item]:hover:!bg-white/10
      [&_.tremor-Legend-item]:!transition-colors
      [&_.tremor-Legend-item]:!cursor-pointer
      [&_.tremor-Legend-item]:focus:!outline-none
      [&_.tremor-Legend-item]:focus:!ring-2
      [&_.tremor-Legend-item]:focus:!ring-accent
      [&_.tremor-Legend-item_text]:!text-white/70
      [&_.tremor-Legend-item_rect]:!rx-[4px]
      [@media(max-width:768px)]:!text-sm
      [@media(max-width:640px)]:!text-xs
      [@media(prefers-reduced-motion:reduce)]:!transition-none
      [@media(prefers-reduced-motion:reduce)]:![&_*]:!transition-none
    `.replace(/\s+/g, ' ').trim(),
  },
  barChart: {
    bar: {
      radius: 4,
      gradient: {
        from: 'rgba(135, 250, 253, 0.2)',
        to: 'rgba(135, 250, 253, 0.05)',
      },
    },
    className: `
      [&_.tremor-BarChart-bar]:drop-shadow-[0_4px_6px_rgba(135,250,253,0.1)]
      [&_.tremor-Legend]:!mt-4 
      [&_.tremor-Legend]:!justify-start 
      [&_.tremor-Legend]:!overflow-x-auto 
      [&_.tremor-Legend-list]:!flex-wrap 
      [&_.tremor-Legend-list]:!gap-4 
      [&_.tremor-Legend]:antialiased 
      [&_text]:fill-white/70 
      [&_line]:stroke-white/5
      [&_.tremor-BarChart]:!h-[300px]
      [&_.tremor-BarChart-bar]:!opacity-60
      [&_.tremor-BarChart-bar]:!transition-all
      [&_.tremor-BarChart-bar]:hover:!opacity-100
      [&_.tremor-BarChart-bar]:hover:!scale-x-[1.02]
      [&_.tremor-BarChart-bar]:hover:!stroke-white/10
      [&_.tremor-BarChart-bar]:hover:!stroke-[1px]
      [&_.tremor-BarChart-bar]:focus:!opacity-100
      [&_.tremor-BarChart-bar]:focus:!outline-none
      [&_.tremor-BarChart-bar]:focus:!ring-2
      [&_.tremor-BarChart-bar]:focus:!ring-accent
      [&_.tremor-BarChart-bar][aria-selected=true]:!opacity-100
      [&_.tremor-Legend-item]:!px-3
      [&_.tremor-Legend-item]:!py-1.5
      [&_.tremor-Legend-item]:!rounded-lg
      [&_.tremor-Legend-item]:!bg-white/5
      [&_.tremor-Legend-item]:hover:!bg-white/10
      [&_.tremor-Legend-item]:!transition-colors
      [&_.tremor-Legend-item]:!cursor-pointer
      [&_.tremor-Legend-item]:focus:!outline-none
      [&_.tremor-Legend-item]:focus:!ring-2
      [&_.tremor-Legend-item]:focus:!ring-accent
      [&_.tremor-Legend-item_text]:!text-white/70
      [&_.tremor-Legend-item_rect]:!rx-[4px]
      [@media(max-width:768px)]:!text-sm
      [@media(max-width:640px)]:!text-xs
      [@media(prefers-reduced-motion:reduce)]:!transition-none
      [@media(prefers-reduced-motion:reduce)]:![&_*]:!transition-none
    `.replace(/\s+/g, ' ').trim(),
  },
  donutChart: {
    track: {
      stroke: 'rgba(255, 255, 255, 0.05)',
      strokeWidth: 2,
    },
    className: '[&_.tremor-DonutChart-slice]:drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)] [&_.tremor-Legend]:!mt-4 [&_.tremor-Legend]:!justify-start [&_.tremor-Legend]:!overflow-x-auto [&_.tremor-Legend-list]:!flex-wrap [&_.tremor-Legend-list]:!gap-4 [&_.tremor-Legend]:antialiased',
  },
};

export const defaultValueFormatter = (value: number) => 
  Intl.NumberFormat('en').format(value).toString();

export const percentageFormatter = (value: number) => 
  `${value}%`;

// Update the getPriorityStyles function to include background styles
const getPriorityStyles = (priority: InsightPriority = 'low') => {
  switch (priority) {
    case 'high':
      return {
        text: 'text-accent font-medium',
        bg: 'bg-accent/[0.08] hover:bg-accent/10'
      };
    case 'medium':
      return {
        text: 'text-white/80',
        bg: 'bg-white/[0.03] hover:bg-white/[0.05]'
      };
    default:
      return {
        text: 'text-white/60',
        bg: 'bg-white/[0.01] hover:bg-white/[0.03]'
      };
  }
};

// Add a new function for highlight reset
const useHighlightReset = (duration: number = 2000) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  const highlight = useCallback(() => {
    setIsHighlighted(true);
    const timer = setTimeout(() => setIsHighlighted(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return { isHighlighted, highlight };
};

// Simplified reset feedback mechanism integrated into BaseChart
export default function BaseChart({
  title,
  subtitle,
  children,
  className = '',
  accessibilityLabel,
  rightContent,
  lastUpdated,
  insights,
  onInsightClick,
  chartId,
  highlightedData,
}: BaseChartProps) {
  const { isHighlighted, highlight } = useHighlightReset();
  const [isResetting, setIsResetting] = useState(false);

  // Handle insight click with temporary highlight
  const handleInsightClick = (insight: InsightType) => {
    if (insight.highlightData) {
      highlight();
      onInsightClick?.(insight);
    }
  };

  // Simplified reset handler with integrated feedback
  const handleResetHighlight = useCallback(() => {
    setIsResetting(true);
    onInsightClick?.(null);
    // Shorter duration for a crisper feel
    setTimeout(() => setIsResetting(false), 200);
  }, [onInsightClick]);

  return (
    <Card 
      className={`${className} bg-black/40 border-accent/20 backdrop-blur-sm transition-all duration-200 ${
        isHighlighted ? 'ring-2 ring-accent/30' : ''
      } ${isResetting ? 'opacity-90 scale-[0.995]' : 'opacity-100 scale-100'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="space-y-1">
            {title && (
              <div className="flex items-center space-x-2.5">
                <Title className="text-white font-medium text-lg md:text-xl antialiased">
                  {title}
                </Title>
                <AnimatePresence>
                  {highlightedData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        duration: 0.2,
                        ease: [0.34, 1.46, 0.64, 1],
                        scale: {
                          type: "spring",
                          damping: 12,
                          stiffness: 150,
                          restDelta: 0.001
                        }
                      }}
                      className="relative group"
                      role="presentation"
                    >
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handleResetHighlight}
                        className="p-1.5 rounded-full bg-accent/10 hover:bg-accent/20 transition-all duration-150"
                        aria-label="Reset highlight"
                      >
                        <XMarkIcon className="w-[18px] h-[18px] text-accent/70 group-hover:text-accent transition-colors duration-150" />
                      </motion.button>
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ 
                          delay: 0.12,
                          duration: 0.15,
                          ease: [0.2, 0.0, 0.0, 1]
                        }}
                        className="absolute left-1/2 -translate-x-1/2 -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-100 pointer-events-none"
                      >
                        <div className="px-2 py-1 text-xs rounded bg-black/90 text-white/90 whitespace-nowrap">
                          Reset highlight
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {subtitle && (
              <Text className="text-white/70 text-sm md:text-base antialiased">
                {subtitle}
              </Text>
            )}
          </div>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
      
      <div className="relative" role="figure" aria-label={accessibilityLabel}>
        {children}
      </div>

      {insights && insights.length > 0 && (
        <div className="mt-4 space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-lg ${getPriorityStyles(insight.priority).bg} transition-colors duration-300`}
              onClick={() => handleInsightClick(insight)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleInsightClick(insight);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isHighlighted}
            >
              <div className="flex items-start group">
                <span className="mr-2 text-accent">•</span>
                <div className="flex-1">
                  <span className={getPriorityStyles(insight.priority).text}>
                    {insight.text}
                  </span>
                  {insight.action && (
                    <span className="text-accent/70 ml-1 text-xs italic">
                      {insight.action}
                    </span>
                  )}
                </div>
              </div>

              {insight.relatedCharts && insight.relatedCharts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 space-y-2"
                >
                  {insight.relatedCharts.map((chartRef, idx) => (
                    <RelatedChartLink
                      key={idx}
                      chartRef={{
                        chartId: chartRef.chartId,
                        insight: chartRef.insight || `View related data in ${chartRef.chartId}`,
                        chartType: 'members' // Assuming a default chart type
                      }}
                      onClick={() => {
                        if (insight.highlightData) {
                          onInsightClick?.(insight);
                        }
                        // Add smooth scroll to related chart
                        const relatedChart = document.getElementById(chartRef.chartId);
                        if (relatedChart) {
                          relatedChart.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          // Add a temporary highlight effect
                          relatedChart.classList.add('ring-4', 'ring-accent/30', 'transition-all', 'duration-500');
                          setTimeout(() => {
                            relatedChart.classList.remove('ring-4', 'ring-accent/30');
                          }, 2000);
                        }
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {insight.isExpandable && (
                <motion.button
                  onClick={() => {
                    // Add logic to expand the insight
                  }}
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 text-white/70 transition-transform duration-300`}
                  />
                </motion.button>
              )}

              <AnimatePresence>
                {/* Add logic to show expanded content */}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
      
      {lastUpdated && (
        <div className="mt-4 flex items-center space-x-2 text-xs text-white/50">
          <ClockIcon className="w-4 h-4" />
          <span>Last updated: {formatDate(lastUpdated)}</span>
        </div>
      )}
    </Card>
  );
} 