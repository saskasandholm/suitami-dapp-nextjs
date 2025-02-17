'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { DiscordLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import PageHeader from '@/components/layout/PageHeader';
import type { TimeRange } from '@/types/community';

// Time range options for analytics
const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'Custom', value: 'custom' },
];

export interface PlatformLinks {
  telegram: string;
  discord: string;
  twitter: string;
}

interface AnalyticsPageHeaderProps {
  title: string;
  description: string;
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  platformLinks: PlatformLinks;
}

export function AnalyticsPageHeader({
  title,
  description,
  selectedTimeRange,
  onTimeRangeChange,
  platformLinks,
}: AnalyticsPageHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={description}
      rightContent={
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedTimeRange === range.value
                    ? 'bg-accent text-black'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            {Object.entries(platformLinks).map(([platform, link]) => {
              const isConnected = link && link !== '#' && !link.includes('your-');
              return (
                <a
                  key={platform}
                  href={isConnected ? link : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isConnected
                      ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
                      : 'bg-white/5 opacity-50 cursor-not-allowed'
                  }`}
                  title={`${platform.charAt(0).toUpperCase() + platform.slice(1)} ${
                    isConnected ? '(Connected)' : '(Not Connected)'
                  }`}
                >
                  {platform === 'telegram' && (
                    <PaperAirplaneIcon
                      className={`w-5 h-5 ${isConnected ? 'text-accent' : 'text-white/50'}`}
                    />
                  )}
                  {platform === 'discord' && (
                    <DiscordLogoIcon
                      className={`w-5 h-5 ${isConnected ? 'text-accent' : 'text-white/50'}`}
                    />
                  )}
                  {platform === 'twitter' && (
                    <TwitterLogoIcon
                      className={`w-5 h-5 ${isConnected ? 'text-accent' : 'text-white/50'}`}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      }
    />
  );
}
