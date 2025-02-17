'use client';

import { Card, Title, Text } from '@tremor/react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { PlatformMetrics } from '@/types/community';

interface HealthScoreCardProps {
  healthScore: number | null;
  platformMetrics: PlatformMetrics | null;
  isMetricsLoading: boolean;
  error: Error | null;
}

export function HealthScoreCard({
  healthScore,
  platformMetrics,
  isMetricsLoading,
  error,
}: HealthScoreCardProps) {
  return (
    <Card className="glass-card h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32 rounded-xl bg-[#87fafd]/10 flex items-center justify-center">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 24 24" className="w-20 h-20">
                  <defs>
                    <clipPath id="heart-clip">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </clipPath>
                    <linearGradient id="wave-gradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#87fafd" />
                      <stop
                        offset={`${healthScore ? Math.max(0, Math.min(100, (healthScore / 90) * 100)) : 0}%`}
                        stopColor="#87fafd"
                      />
                      <stop
                        offset={`${healthScore ? Math.max(0, Math.min(100, (healthScore / 90) * 100)) : 0}%`}
                        stopColor="rgba(135, 250, 253, 0.1)"
                      />
                      <stop offset="100%" stopColor="rgba(135, 250, 253, 0.1)" />
                    </linearGradient>
                    <filter id="wave" x="0" y="0" width="100%" height="100%">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01 0.05"
                        numOctaves="2"
                        result="noise"
                        seed="1"
                      >
                        <animate
                          attributeName="seed"
                          from="1"
                          to="2"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </feTurbulence>
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                  </defs>
                  {/* Background heart (filled with gradient) */}
                  <g clipPath="url(#heart-clip)">
                    <rect x="0" y="0" width="24" height="24" fill="rgba(135, 250, 253, 0.1)" />
                    <rect
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                      fill="url(#wave-gradient)"
                      filter="url(#wave)"
                      className="transition-all duration-1000"
                    />
                  </g>
                  {/* Heart outline */}
                  <path
                    d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                    fill="none"
                    stroke="#87fafd"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
            </div>
            <div>
              <Text className="text-white/70 text-lg mb-1">Overall Health Score</Text>
              {isMetricsLoading ? (
                <div className="animate-pulse bg-white/10 h-12 w-32 rounded mt-1"></div>
              ) : error ? (
                <Text className="text-red-400 text-4xl">Error</Text>
              ) : healthScore === null ? (
                <Text className="text-yellow-400 text-4xl">N/A</Text>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <Title className="text-white text-5xl font-semibold">
                      {healthScore.toFixed(1)}
                    </Title>
                    <Text className="text-white/50">/ 100</Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    {healthScore >= 80 ? (
                      <ArrowUpCircleIcon className="w-5 h-5 text-emerald-400" />
                    ) : healthScore >= 60 ? (
                      <ArrowPathIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <ArrowDownCircleIcon className="w-5 h-5 text-rose-400" />
                    )}
                    <Text
                      className={`text-sm ${
                        healthScore >= 80
                          ? 'text-emerald-400'
                          : healthScore >= 60
                            ? 'text-yellow-400'
                            : 'text-rose-400'
                      }`}
                    >
                      {healthScore >= 80
                        ? 'Healthy'
                        : healthScore >= 60
                          ? 'Needs Attention'
                          : 'Critical'}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Insights */}
          <div className="border-l border-white/10 pl-8">
            <Text className="text-white/70 text-lg mb-4">Key Insights</Text>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-emerald-400/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <ArrowUpCircleIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <Text className="text-white/90">
                  Discord shows strongest performance with 82% health score
                </Text>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-yellow-400/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <ArrowPathIcon className="w-4 h-4 text-yellow-400" />
                </div>
                <Text className="text-white/90">
                  Telegram and Twitter need attention to improve engagement
                </Text>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <ChartBarIcon className="w-4 h-4 text-accent" />
                </div>
                <Text className="text-white/90">
                  Overall trend is positive across all platforms
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Platform-specific health indicators */}
        <div className="grid grid-cols-3 gap-4">
          {platformMetrics &&
            Object.entries(platformMetrics).map(([platform, metrics]) => (
              <div
                key={platform}
                className="flex flex-col p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-2 mb-3">
                  {platform === 'telegram' && <PaperAirplaneIcon className="w-5 h-5 text-accent" />}
                  {platform === 'discord' && <DiscordLogoIcon className="w-5 h-5 text-accent" />}
                  {platform === 'twitter' && <TwitterLogoIcon className="w-5 h-5 text-accent" />}
                  <div className="text-base text-white/90 capitalize">{platform}</div>
                </div>

                <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.sentiment.score}%` }}
                    className={`absolute h-full rounded-full ${
                      metrics.sentiment.score >= 80
                        ? 'bg-emerald-400'
                        : metrics.sentiment.score >= 60
                          ? 'bg-yellow-400'
                          : 'bg-rose-400'
                    }`}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-semibold text-white">
                      {metrics.sentiment.score}
                    </span>
                    <span className="text-sm text-white/50">/100</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {metrics.sentiment.trend === 'up' ? (
                      <ArrowUpCircleIcon className="w-4 h-4 text-emerald-400" />
                    ) : metrics.sentiment.trend === 'down' ? (
                      <ArrowDownCircleIcon className="w-4 h-4 text-rose-400" />
                    ) : (
                      <ArrowPathIcon className="w-4 h-4 text-yellow-400" />
                    )}
                    <span
                      className={`text-sm ${
                        metrics.sentiment.trend === 'up'
                          ? 'text-emerald-400'
                          : metrics.sentiment.trend === 'down'
                            ? 'text-rose-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {metrics.sentiment.trend === 'up'
                        ? 'Improving'
                        : metrics.sentiment.trend === 'down'
                          ? 'Declining'
                          : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}
