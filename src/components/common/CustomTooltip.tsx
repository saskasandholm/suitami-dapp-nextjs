import { CustomTooltipProps } from '@tremor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatValue } from '@/utils/formatters';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface EnrichedData {
  percentChange?: number;
  benchmark?: {
    type: 'average' | 'previous' | 'target';
    value: number;
  };
  context?: string;
}

interface TooltipItem {
  name: string | number;
  value: string | number;
  color: string;
  dataKey: string;
}

export default function CustomTooltip({ 
  active, 
  payload, 
  label 
}: CustomTooltipProps) {
  if (!active || !payload) return null;

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable', percentChange?: number) => {
    if (!trend && !percentChange) return null;
    
    const actualTrend = trend || (percentChange ? (percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable') : 'stable');
    const Icon = actualTrend === 'up' 
      ? ArrowTrendingUpIcon 
      : actualTrend === 'down' 
        ? ArrowTrendingDownIcon 
        : MinusIcon;

    const color = actualTrend === 'up'
      ? 'text-emerald-400'
      : actualTrend === 'down'
        ? 'text-red-400'
        : 'text-yellow-400';

    return (
      <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
    );
  };

  const formatPercentChange = (value?: number) => {
    if (!value) return null;
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(1)}%`;
  };

  const getEnrichedData = (value: number): EnrichedData | null => {
    const element = document.querySelector(`[data-value="${value}"]`);
    if (!element) return null;
    
    const enrichedAttr = element.getAttribute('data-enriched');
    if (!enrichedAttr) return null;

    try {
      return JSON.parse(enrichedAttr);
    } catch {
      return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.22,
          ease: [0.32, 0.0, 0.15, 1],
          opacity: { 
            duration: 0.18,
            ease: [0.4, 0.0, 0.2, 1]
          }
        }}
        className="bg-black/90 backdrop-blur-sm border border-accent/20 rounded-lg p-4 shadow-xl max-w-xs"
        role="tooltip"
        aria-label={`Data for ${label}`}
      >
        {label && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="text-white/80 text-sm font-medium mb-2 pb-2 border-b border-white/10"
          >
            {label}
          </motion.div>
        )}
        <div className="space-y-3">
          {payload.map((item, index) => {
            const tooltipItem = item as unknown as TooltipItem;
            const enrichedData = getEnrichedData(Number(tooltipItem.value));
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.06,
                  duration: 0.18,
                  ease: [0.2, 0.9, 0.2, 1]
                }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tooltipItem.color }}
                      aria-hidden="true"
                    />
                    <span className="text-white/80 text-sm">{String(tooltipItem.name)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-accent font-medium">
                      {formatValue(Number(tooltipItem.value), tooltipItem.dataKey)}
                    </span>
                    {enrichedData?.percentChange !== undefined && (
                      <div className={`flex items-center space-x-1 text-xs ${
                        enrichedData.percentChange > 0 
                          ? 'text-emerald-400' 
                          : enrichedData.percentChange < 0 
                            ? 'text-red-400' 
                            : 'text-yellow-400'
                      }`}>
                        {getTrendIcon(undefined, enrichedData.percentChange)}
                        <span>{formatPercentChange(enrichedData.percentChange)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Benchmark comparison */}
                {enrichedData?.benchmark && (
                  <div className="flex items-center justify-between text-xs text-white/60 pl-4">
                    <span>vs {enrichedData.benchmark.type}:</span>
                    <div className="flex items-center space-x-1">
                      <span>{formatValue(enrichedData.benchmark.value, tooltipItem.dataKey)}</span>
                      {Number(tooltipItem.value) !== enrichedData.benchmark.value && (
                        <span className={
                          Number(tooltipItem.value) > enrichedData.benchmark.value 
                            ? 'text-emerald-400' 
                            : 'text-red-400'
                        }>
                          ({formatPercentChange(
                            ((Number(tooltipItem.value) - enrichedData.benchmark.value) / enrichedData.benchmark.value) * 100
                          )})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Context information */}
                {enrichedData?.context && (
                  <div className="flex items-start space-x-1.5 text-xs text-white/60 pl-4">
                    <InformationCircleIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{enrichedData.context}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 