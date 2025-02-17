import type { PlatformMetrics } from '@/types/community';

interface CommunityMetricCalculations {
  totalMembers: number;
  totalActive: number;
  totalMessages: number;
  averageEngagement: number;
}

export function calculateCommunityMetrics(
  platformMetrics: PlatformMetrics
): CommunityMetricCalculations {
  // Calculate total members across all platforms
  const totalMembers =
    platformMetrics.telegram.members +
    platformMetrics.discord.members +
    platformMetrics.twitter.followers;

  // Calculate total active members
  const totalActive =
    platformMetrics.telegram.active +
    platformMetrics.discord.active +
    platformMetrics.twitter.active;

  // Calculate total messages (only from chat platforms)
  const totalMessages = platformMetrics.telegram.messages + platformMetrics.discord.messages;

  // Calculate average engagement across all platforms
  const averageEngagement = Math.round(
    (platformMetrics.telegram.engagement +
      platformMetrics.discord.engagement +
      platformMetrics.twitter.engagement) /
      3
  );

  return {
    totalMembers,
    totalActive,
    totalMessages,
    averageEngagement,
  };
}
