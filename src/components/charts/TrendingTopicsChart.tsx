import { Card, Title, Text } from '@tremor/react';
import { HashtagIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { formatValue } from '@/utils/formatters';
import styles from './TrendingTopicsChart.module.css';

interface TrendingTopic {
  topic: string;
  mentions: number;
  sentiment: number;
  trend: 'up' | 'down' | 'stable';
  relatedTopics?: string[];
}

interface TrendingTopicsChartProps {
  topics: TrendingTopic[];
}

// Define sentiment and trend color mappings
const sentimentColors = {
  high: { bg: 'bg-emerald-400/10', text: 'text-emerald-400' },
  medium: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  low: { bg: 'bg-rose-400/10', text: 'text-rose-400' },
} as const;

const trendColors = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  stable: 'text-yellow-400',
} as const;

export default function TrendingTopicsChart({ topics }: TrendingTopicsChartProps) {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 80) return sentimentColors.high;
    if (sentiment >= 60) return sentimentColors.medium;
    return sentimentColors.low;
  };

  return (
    <Card className="glass-card h-full">
      <Title className="text-white mb-4">Trending Topics</Title>
      <div className={styles.topicsList} role="list">
        {topics.map((topic, index) => {
          const sentimentColor = getSentimentColor(topic.sentiment);
          return (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={styles.topicItem}
              role="listitem"
            >
              <div className={styles.topicContent}>
                <div className={styles.topicHeader}>
                  <div className={styles.iconContainer}>
                    <HashtagIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <Text className={styles.topicTitle}>{topic.topic}</Text>
                    <Text className={styles.topicMentions}>
                      {formatValue(topic.mentions, 'mentions')} mentions
                    </Text>
                  </div>
                </div>
                <div className={styles.topicMetrics}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`${styles.sentimentBadge} ${sentimentColor.bg} ${sentimentColor.text}`}
                  >
                    {topic.sentiment}% positive
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} className={styles.trendContainer}>
                    <ArrowTrendingUpIcon className={`w-4 h-4 ${trendColors[topic.trend]}`} />
                  </motion.div>
                </div>
              </div>
              {topic.relatedTopics && topic.relatedTopics.length > 0 && (
                <div className={styles.relatedTopics}>
                  {topic.relatedTopics.map(relatedTopic => (
                    <span key={relatedTopic} className={styles.relatedTopic}>
                      {relatedTopic}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
