import { ReactNode, useState, useCallback, useRef, useEffect } from 'react';
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
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useHighlightReset } from '@/hooks/useHighlightReset';
import { chartStyles } from '@/styles/chartStyles';

// Type definitions
export type ChartType = 'bar' | 'area' | 'donut' | 'sentiment' | 'engagement' | 'members';
export type InsightPriority = 'high' | 'medium' | 'low';

export interface HighlightedData {
  key: 'hour' | 'category' | 'period' | string;
  value: string | number;
}

export interface InsightRelatedData {
  trend?: number;
  currentGrowth?: number;
  details?: string;
  percentChange?: number;
  benchmark?: {
    type: 'average' | 'previous' | 'target';
    value: number;
  };
  context?: string;
  activeRatio?: number;
  totalMembers?: number;
  activeMembers?: number;
  newMembers?: number;
  joinDates?: string;
  hour?: string;
  total?: number;
  breakdown?: string;
  type?: string;
  count?: number;
  percentage?: string;
  avgActivity?: number;
}

export interface InsightType {
  text: string;
  priority?: InsightPriority;
  action?: string;
  isExpandable?: boolean;
  relatedData?: InsightRelatedData;
  highlightData?: HighlightedData;
  relatedCharts?: Array<{
    chartId: string;
    insight?: string;
    chartType?: ChartType;
    color?: string;
  }>;
}

export interface BaseChartProps {
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
  highlightedData?: HighlightedData;
  valueFormatter?: (value: number) => string;
}

// Add a map for chart type icons
const chartTypeIcons = {
  bar: ChartBarIcon,
  area: ChartBarSquareIcon,
  donut: ChartPieIcon,
  sentiment: ChatBubbleLeftRightIcon,
  engagement: HeartIcon,
  members: UserGroupIcon,
} as const;

// Add a map for chart type colors
const chartTypeColors = {
  bar: 'text-cyan-400',
  area: 'text-emerald-400',
  donut: 'text-violet-400',
  sentiment: 'text-yellow-400',
  engagement: 'text-pink-400',
  members: 'text-blue-400',
} as const;

// Helper function to format dates consistently
const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

// Helper function to get priority styles
const getPriorityStyles = (priority?: InsightPriority) => {
  switch (priority) {
    case 'high':
      return {
        bg: 'bg-white/5 hover:bg-white/10',
        text: 'text-white/90',
      };
    case 'medium':
      return {
        bg: 'bg-white/5 hover:bg-white/10',
        text: 'text-white/80',
      };
    case 'low':
      return {
        bg: 'bg-white/5 hover:bg-white/10',
        text: 'text-white/70',
      };
    default:
      return {
        bg: 'bg-white/5 hover:bg-white/10',
        text: 'text-white/70',
      };
  }
};

// Update the RelatedChartLink component
const RelatedChartLink = ({
  chartRef,
  onClick,
}: {
  chartRef: {
    chartId: string;
    insight: string;
    chartType?: keyof typeof chartTypeIcons;
    color?: string;
  };
  onClick: () => void;
}) => {
  const Icon = chartRef.chartType ? chartTypeIcons[chartRef.chartType] : ArrowTopRightOnSquareIcon;
  const colorClass =
    chartRef.color || (chartRef.chartType ? chartTypeColors[chartRef.chartType] : 'text-accent');

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

// Default value formatter
const defaultValueFormatter = (value: number): string => value.toString();

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
  valueFormatter = defaultValueFormatter,
}: BaseChartProps) {
  const { isHighlighted, highlight, reset } = useHighlightReset();
  const [isResetting, setIsResetting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [renderAttempts, setRenderAttempts] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const startTime = performance.now();
      console.log(
        `[BaseChart:${chartId}] Initializing container measurements at ${new Date().toISOString()}`
      );

      let timeoutId: NodeJS.Timeout | null = null;
      const updateDimensions = (): void => {
        if (!containerRef.current) {
          return;
        }

        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Debounce the dimension update
        timeoutId = setTimeout(() => {
          const { offsetWidth, offsetHeight } = containerRef.current!;
          const newDimensions = { width: offsetWidth, height: offsetHeight };

          // Only update if dimensions have actually changed
          if (
            newDimensions.width !== dimensions.width ||
            newDimensions.height !== dimensions.height
          ) {
            console.log(`[BaseChart:${chartId}] Container dimensions updated:`, {
              ...newDimensions,
              previousDimensions: dimensions,
              updateTime: `${(performance.now() - startTime).toFixed(2)}ms`,
              renderAttempt: renderAttempts + 1,
            });

            setDimensions(newDimensions);
            setRenderAttempts(prev => prev + 1);
          }
        }, 100);
      };

      // Initial measurement
      updateDimensions();

      // Setup resize observer
      const observer = new ResizeObserver(entries => {
        console.log(`[BaseChart:${chartId}] ResizeObserver triggered:`, {
          timestamp: new Date().toISOString(),
          entries: entries.length,
        });
        updateDimensions();
      });

      observer.observe(containerRef.current);

      return () => {
        console.log(`[BaseChart:${chartId}] Cleanup - removing resize observer`);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        observer.disconnect();
      };
    }
    return undefined;
  }, [chartId]); // Remove dimensions and renderAttempts from dependencies

  // Log when chart is about to render
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      console.log(`[BaseChart:${chartId}] Ready to render chart:`, {
        dimensions,
        timestamp: new Date().toISOString(),
        renderAttempt: renderAttempts,
      });
    }
  }, [dimensions, chartId, renderAttempts]);

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
    reset();
    setTimeout(() => setIsResetting(false), 200);
  }, [onInsightClick, reset]);

  return (
    <motion.div
      className={`glass-card p-6 min-h-[400px] space-y-4 ${className}`}
      role="region"
      aria-label={accessibilityLabel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
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
                            type: 'spring',
                            damping: 12,
                            stiffness: 150,
                            restDelta: 0.001,
                          },
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
                            ease: [0.2, 0.0, 0.0, 1],
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
                <Text className="text-white/70 text-sm md:text-base antialiased">{subtitle}</Text>
              )}
            </div>
          </div>
          {rightContent && <div>{rightContent}</div>}
        </div>

        <div className="flex-1 relative">
          <div
            ref={containerRef}
            className="relative w-full flex items-center justify-center bg-white/[0.01] rounded-lg overflow-hidden transition-all duration-200"
            role="figure"
            aria-label={accessibilityLabel}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              aspectRatio: '16/9',
              transform: 'translateZ(0)', // Force GPU acceleration
            }}
          >
            {(() => {
              if (dimensions.width > 0 && dimensions.height > 0) {
                console.log(`[BaseChart:${chartId}] Rendering chart with dimensions:`, {
                  width: dimensions.width,
                  height: dimensions.height,
                  timestamp: new Date().toISOString(),
                });
                return (
                  <div
                    className="w-full h-full"
                    style={{
                      minWidth: '300px',
                      minHeight: '300px',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {children}
                  </div>
                );
              }
              console.log(`[BaseChart:${chartId}] Waiting for dimensions...`, {
                timestamp: new Date().toISOString(),
                currentDimensions: dimensions,
              });
              return (
                <div
                  className="text-white/50 w-full h-full flex items-center justify-center"
                  style={{ minWidth: '300px', minHeight: '300px' }}
                >
                  Initializing chart...
                </div>
              );
            })()}
          </div>
        </div>

        {insights && insights.length > 0 && (
          <div className="mt-4 space-y-3 relative z-10">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-lg ${getPriorityStyles(insight.priority).bg} transition-colors duration-300`}
                onClick={() => handleInsightClick(insight)}
                onKeyDown={e => {
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
                    <span className={getPriorityStyles(insight.priority).text}>{insight.text}</span>
                    {insight.action && (
                      <span className="text-accent/70 ml-1 text-xs italic">{insight.action}</span>
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
                          chartType: 'members', // Assuming a default chart type
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
                            relatedChart.classList.add(
                              'ring-4',
                              'ring-accent/30',
                              'transition-all',
                              'duration-500'
                            );
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

                <AnimatePresence>{/* Add logic to show expanded content */}</AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {lastUpdated && (
          <div className="mt-4 flex items-center space-x-2 text-xs text-white/50 relative z-10">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {formatDate(lastUpdated)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
