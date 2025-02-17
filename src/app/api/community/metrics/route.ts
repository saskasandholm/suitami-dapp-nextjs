import { NextResponse } from 'next/server';
import {
  generateMockPlatformMetrics,
  generateMockAllPlatformMetrics,
} from '@/mocks/communityMockData';
import type { CommunityMetrics } from '@/types/community';

const ARTIFICIAL_DELAY = 500;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function validateMetrics(metrics: CommunityMetrics): boolean {
  return !!(metrics.sentiment?.score && metrics.engagement?.rate && metrics.growth?.rate);
}

export async function GET(request: Request) {
  try {
    await delay(ARTIFICIAL_DELAY);

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'all';
    const timeRange = searchParams.get('timeRange') || '24h';

    console.log(`[API] Generating metrics for platform: ${platform}, timeRange: ${timeRange}`);

    const metrics =
      platform === 'all' ? generateMockAllPlatformMetrics() : generateMockPlatformMetrics(platform);

    console.log(`[API] Generated metrics:`, JSON.stringify(metrics, null, 2));

    if (!validateMetrics(metrics)) {
      console.error('[API] Invalid metrics data:', metrics);
      return NextResponse.json({ error: 'Invalid metrics data' }, { status: 400 });
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[API] Error generating metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
