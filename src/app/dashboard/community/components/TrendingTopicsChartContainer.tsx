'use client';

import { motion } from 'framer-motion';
import TrendingTopicsChart from '@/components/charts/TrendingTopicsChart';
import TrendingTopicsChartSkeleton from '@/components/charts/TrendingTopicsChartSkeleton';
import type { TrendingTopic } from '@/types/community';

interface TrendingTopicsChartContainerProps {
  isLoading: boolean;
  topics: TrendingTopic[];
}

export function TrendingTopicsChartContainer({
  isLoading,
  topics,
}: TrendingTopicsChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {isLoading ? <TrendingTopicsChartSkeleton /> : <TrendingTopicsChart topics={topics} />}
    </motion.div>
  );
}
