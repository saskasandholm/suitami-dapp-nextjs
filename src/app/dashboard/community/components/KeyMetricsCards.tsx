'use client';

import { Card, Title, Text } from '@tremor/react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  HeartIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface MetricCard {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  positive: boolean;
  hasAnomaly?: boolean;
}

interface KeyMetricsCardsProps {
  totalMembers: number;
  totalActive: number;
  totalMessages: number;
  averageEngagement: number;
  hasAnomalyInGrowth: boolean;
}

export function KeyMetricsCards({
  totalMembers,
  totalActive,
  totalMessages,
  averageEngagement,
  hasAnomalyInGrowth,
}: KeyMetricsCardsProps) {
  const metrics: MetricCard[] = [
    {
      title: 'Total Members',
      value: Intl.NumberFormat('en', { notation: 'compact' }).format(totalMembers),
      icon: UserGroupIcon,
      change: '+12%',
      positive: true,
      hasAnomaly: hasAnomalyInGrowth,
    },
    {
      title: 'Active Members',
      value: Intl.NumberFormat('en', { notation: 'compact' }).format(totalActive),
      icon: HeartIcon,
      change: '+8%',
      positive: true,
    },
    {
      title: 'Messages (24h)',
      value: Intl.NumberFormat('en', { notation: 'compact' }).format(totalMessages),
      icon: ChatBubbleLeftRightIcon,
      change: '+15%',
      positive: true,
    },
    {
      title: 'Avg. Engagement',
      value: `${averageEngagement}%`,
      icon: ChartBarIcon,
      change: '+5%',
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card hover-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-[#87fafd]/10 flex items-center justify-center mr-4">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <Text className="text-white/70">{stat.title}</Text>
                  <Title className="text-white text-2xl">{stat.value}</Title>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {stat.hasAnomaly && (
                  <ExclamationCircleIcon
                    className="w-5 h-5 text-yellow-400"
                    title="Unusual activity detected"
                  />
                )}
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    stat.positive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
