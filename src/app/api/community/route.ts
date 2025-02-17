import { NextResponse } from 'next/server';
import {
  generateMockPlatformMetrics,
  generateMockSentimentData,
  generateMockTrendingTopics,
  generateMockAllPlatformMetrics,
  generateMockMemberGrowthData,
  generateMockHourlyActivity,
  validateHourlyActivityConfig,
} from '@/mocks/communityMockData';
import type { HourlyActivityConfig } from '@/types/community';

// Add artificial delay to simulate network latency
const ARTIFICIAL_DELAY = 500;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Add error response helper
function createErrorResponse(status: number, message: string, details?: any) {
  return NextResponse.json(
    {
      error: message,
      details: details || undefined,
    },
    { status }
  );
}

export async function GET(request: Request) {
  try {
    // Add artificial delay
    await delay(ARTIFICIAL_DELAY);

    // Parse URL and get search params
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const platform = searchParams.get('platform') || 'all';
    const timeRange = searchParams.get('timeRange') || '24h';
    const hourlyActivityConfigStr = searchParams.get('hourlyActivityConfig');

    // Parse and validate hourly activity config if provided
    let hourlyActivityConfig: HourlyActivityConfig | undefined;
    if (hourlyActivityConfigStr) {
      try {
        // Parse the JSON string
        const parsedConfig = JSON.parse(hourlyActivityConfigStr);

        // Type check and validate the parsed config
        if (parsedConfig && typeof parsedConfig === 'object') {
          const validation = validateHourlyActivityConfig(parsedConfig as HourlyActivityConfig);
          if (!validation.isValid) {
            return createErrorResponse(400, 'Invalid hourlyActivityConfig: Validation failed', {
              errors: validation.errors,
              providedConfig: parsedConfig,
            });
          }
          hourlyActivityConfig = parsedConfig;
        } else {
          return createErrorResponse(
            400,
            'Invalid hourlyActivityConfig: Must be a valid configuration object',
            {
              providedConfig: parsedConfig,
              expectedType: 'object',
            }
          );
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          return createErrorResponse(400, 'Invalid hourlyActivityConfig: Failed to parse JSON', {
            providedConfig: hourlyActivityConfigStr,
            parseError: error.message,
          });
        }
        return createErrorResponse(400, 'Invalid hourlyActivityConfig: Validation error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          providedConfig: hourlyActivityConfigStr,
        });
      }
    }

    // Validate timeRange
    const validTimeRanges = ['24h', '7d', '30d', '90d', 'custom'];
    if (!validTimeRanges.includes(timeRange)) {
      return createErrorResponse(400, 'Invalid timeRange parameter', {
        providedValue: timeRange,
        validValues: validTimeRanges,
      });
    }

    // Convert timeRange to number of days
    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      custom: 30, // Default to 30 days for custom range
    };

    const days = daysMap[timeRange];

    // Generate all required data
    const metrics =
      platform === 'all' ? generateMockAllPlatformMetrics() : generateMockPlatformMetrics(platform);

    const sentiment = generateMockSentimentData(days);
    const topics = generateMockTrendingTopics();
    const memberGrowth = generateMockMemberGrowthData(days);
    const hourlyActivity = generateMockHourlyActivity(hourlyActivityConfig);

    // Return combined response
    return NextResponse.json({
      metrics,
      sentiment,
      topics,
      memberGrowth,
      hourlyActivity,
      growthAnomalies: [], // TODO: Implement growth anomalies detection
    });
  } catch (error) {
    console.error('API Error:', error);
    return createErrorResponse(
      500,
      'Internal server error',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
