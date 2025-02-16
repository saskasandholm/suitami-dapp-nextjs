import { NextResponse } from 'next/server';
import { generateMockTrendingTopics } from '@/mocks/communityMockData';

const ARTIFICIAL_DELAY = 500;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(_request: Request) {
  try {
    await delay(ARTIFICIAL_DELAY);

    const response = generateMockTrendingTopics();
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 