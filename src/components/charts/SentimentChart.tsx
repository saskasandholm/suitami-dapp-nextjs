import { AreaChart, Text } from '@tremor/react';
import { motion } from 'framer-motion';
import { 
  FaceSmileIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import BaseChart, { chartStyles } from './BaseChart';
import CustomTooltip from './CustomTooltip';
import { formatValue } from '@/utils/formatters';

interface SentimentData {
  date: string;
  score: number;
}

interface SentimentChartProps {
  data: SentimentData[];
  trend?: 'up' | 'down' | 'stable';
}

export default function SentimentChart({ data, trend = 'up' }: SentimentChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Calculate trend metrics
  const trendMetrics = useMemo(() => {
    const TrendIcon = trend === 'up' 
      ? ArrowTrendingUpIcon 
      : trend === 'down' 
        ? ArrowTrendingDownIcon 
        : MinusIcon;

    const trendColor = trend === 'up' 
      ? 'text-green-400' 
      : trend === 'down' 
        ? 'text-red-400' 
        : 'text-yellow-400';

    const trendBg = trend === 'up'
      ? 'bg-green-400/10'
      : trend === 'down'
        ? 'bg-red-400/10'
        : 'bg-yellow-400/10';

    const trendText = trend === 'up' 
      ? 'Positive Trend' 
      : trend === 'down' 
        ? 'Negative Trend' 
        : 'Stable';

    // Calculate average score and change
    const avgScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;
    const scoreChange = data.length > 1 
      ? ((data[data.length - 1].score - data[0].score) / data[0].score * 100).toFixed(1)
      : '0';

    return { TrendIcon, trendColor, trendBg, trendText, avgScore, scoreChange };
  }, [data, trend]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="h-full"
    >
      <BaseChart
        title="Community Sentiment"
        subtitle="Track community sentiment trends and changes over time"
        accessibilityLabel="Community sentiment trends over time showing sentiment scores and trend direction"
        rightContent={
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-accent/10">
              <FaceSmileIcon className="w-4 h-4 text-accent" />
              <Text className="text-sm text-accent">
                Avg: {formatValue(trendMetrics.avgScore, 'percent')}
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
        className="transition-transform duration-200 hover:scale-[1.01]"
      >
        <div className="relative group">
          <AreaChart
            className={`${chartStyles.areaChart.className} transition-opacity duration-200`}
            data={data}
            index="date"
            categories={['score']}
            colors={['cyan']}
            valueFormatter={(value) => formatValue(value, 'percent')}
            showAnimation={true}
            curveType="monotone"
            customTooltip={CustomTooltip}
            showGridLines={false}
            minValue={0}
            maxValue={100}
            startEndOnly={true}
            onValueChange={(v: any) => {
              setHoveredPoint(v?.score || null);
            }}
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
          {trend !== 'stable' && (
            <div 
              className={`absolute bottom-0 left-0 w-full h-0.5 ${
                trend === 'up' ? 'bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/40' 
                : 'bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/40'
              } transform ${
                trend === 'up' ? '-rotate-1' : 'rotate-1'
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