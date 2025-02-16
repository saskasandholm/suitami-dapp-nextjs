import { Card, Title, Text } from '@tremor/react';
import { HashtagIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { formatValue } from '@/utils/formatters';

interface TrendingTopic {
  topic: string;
  mentions: number;
  sentiment: number;
  trend: 'up' | 'down' | 'stable';
}

interface TrendingTopicsChartProps {
  topics: TrendingTopic[];
}

export default function TrendingTopicsChart({ topics }: TrendingTopicsChartProps) {
  return (
    <Card className="glass-card h-full">
      <Title className="text-white mb-4">Trending Topics</Title>
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar" role="list">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
            role="listitem"
          >
            <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <HashtagIcon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <Text className="text-white font-medium group-hover:text-accent transition-colors">
                    {topic.topic}
                  </Text>
                  <Text className="text-white/50">
                    {formatValue(topic.mentions, 'mentions')} mentions
                  </Text>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-2 py-1 rounded-full text-xs ${
                    topic.sentiment >= 80
                      ? 'bg-green-400/10 text-green-400'
                      : topic.sentiment >= 60
                        ? 'bg-yellow-400/10 text-yellow-400'
                        : 'bg-red-400/10 text-red-400'
                  }`}
                >
                  {topic.sentiment}% positive
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                >
                  <ArrowTrendingUpIcon
                    className={`w-4 h-4 ${
                      topic.trend === 'up'
                        ? 'text-green-400'
                        : topic.trend === 'down'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                    }`}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(135, 250, 253, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(135, 250, 253, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(135, 250, 253, 0.5);
        }
      `}</style>
    </Card>
  );
} 