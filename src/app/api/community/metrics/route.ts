import { NextResponse } from 'next/server';
import {
  generateMockPlatformMetrics,
  generateMockAllPlatformMetrics
} from '@/mocks/communityMockData';

const ARTIFICIAL_DELAY = 500;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  try {
    await delay(ARTIFICIAL_DELAY);

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'all';
    const _timeRange = searchParams.get('timeRange') || '24h';

    const response = platform === 'all'
      ? generateMockAllPlatformMetrics()
      : generateMockPlatformMetrics(platform);

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 