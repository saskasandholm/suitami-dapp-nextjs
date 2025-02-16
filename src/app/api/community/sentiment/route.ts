import { NextResponse } from 'next/server';
import { generateMockSentimentData } from '@/mocks/communityMockData';

const ARTIFICIAL_DELAY = 500;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  try {
    await delay(ARTIFICIAL_DELAY);

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';

    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      'custom': 30 // Default to 30 days for custom range
    };

    const response = generateMockSentimentData(daysMap[timeRange] || 7);
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 