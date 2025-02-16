export interface CommunityMetrics {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    trend: 'up' | 'down' | 'stable';
  };
  // Add other metric types as needed
} 