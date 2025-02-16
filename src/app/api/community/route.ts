import { NextResponse } from 'next/server';
import {
  generateMockPlatformMetrics,
  generateMockSentimentData,
  generateMockTrendingTopics,
  generateMockAllPlatformMetrics
} from '@/mocks/communityMockData';

// Add artificial delay to simulate network latency
const ARTIFICIAL_DELAY = 500;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  try {
    // Add artificial delay
    await delay(ARTIFICIAL_DELAY);

    // Parse URL and get endpoint from pathname
    const url = new URL(request.url);
    const endpoint = url.pathname.split('/').pop();
    const searchParams = url.searchParams;
    const platform = searchParams.get('platform') || 'all';
    const timeRange = searchParams.get('timeRange') || '24h';

    // Convert timeRange to number of days for sentiment data
    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      'custom': 30 // Default to 30 days for custom range
    };

    let response;
    switch (endpoint) {
      case 'metrics':
        response = platform === 'all' 
          ? generateMockAllPlatformMetrics()
          : generateMockPlatformMetrics(platform);
        break;

      case 'sentiment':
        response = generateMockSentimentData(daysMap[timeRange] || 7);
        break;

      case 'trending-topics':
        response = generateMockTrendingTopics();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid endpoint' },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 