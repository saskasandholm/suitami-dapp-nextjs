# Community Analytics Documentation

## Overview

This documentation covers the community analytics features, including metrics calculation, data visualization, and health scoring.

## Community Health Score

The Community Health Score is a composite metric that provides a holistic view of community health, calculated on a scale of 0-100. The score is weighted across three key dimensions:

### Score Components

1. **Sentiment Score (40% weight)**

   - Measures the overall sentiment of community interactions
   - Based on the ratio of positive, neutral, and negative sentiment
   - Normalized to a 0-100 scale

2. **Engagement Rate (30% weight)**

   - Measures active participation and interaction levels
   - Direct percentage value from platform metrics
   - Scale: 0-100%

3. **Growth Rate (30% weight)**
   - Measures community expansion and retention
   - Normalized against a 20% benchmark for healthy growth
   - Converted to a 0-100 scale

### Calculation Method

The final health score is calculated using the following steps:

1. Each component is weighted according to its importance
2. Scores are normalized to ensure consistent scaling
3. Components are combined and rounded to the nearest integer
4. Final score is capped between 0 and 100

### Score Interpretation

- **90-100**: Exceptional community health
- **80-89**: Very healthy community (current score: 87.0)
- **70-79**: Healthy community
- **60-69**: Moderate health, room for improvement
- **Below 60**: Requires attention and intervention

## Data Sources

The analytics dashboard aggregates data from multiple platforms:

- Discord
- Telegram
- Twitter

Each platform provides metrics for:

- Member/follower count
- Active users
- Message volume
- Engagement rates
- Sentiment analysis
- Growth trends

## Metrics Validation

All metrics undergo validation before being used in calculations:

- Required fields must be present
- Values must be within expected ranges
- Trend data must have valid directional indicators

# Community Analytics

## Quick Start

- [Setup Guide](#setup-guide)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

### Quick "Hello World" Example

```tsx
// 1. Install dependencies
pnpm install @tremor/react framer-motion swr

// 2. Create a basic metrics component
import { useCommunityData } from '@/hooks/useCommunityData';
import { Card } from '@/components/ui/Card';

export function BasicMetrics() {
  const { data, error } = useCommunityData({
    platform: 'all',
    timeRange: '24h'
  });

  if (error) return <div>Failed to load metrics</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Card>
      <h3 className="text-lg font-medium">Active Users</h3>
      <div className="mt-4 text-2xl font-bold">
        {data.activeUsers.toLocaleString()}
      </div>
    </Card>
  );
}
```

## Table of Contents

1. [Overview](#overview)
2. [Setup Guide](#setup-guide)
3. [Features & Implementation](#features)
   - [Performance](#performance-optimizations)
   - [Data Visualization](#data-visualization)
   - [Metrics & Insights](#metrics--insights)
   - [Accessibility](#accessibility)
4. [Common Tasks](#common-tasks)
5. [Technical Guidelines](#technical-guidelines)
   - [Animation](#animation-guidelines)
   - [Error Handling](#error-handling)
   - [Data Processing](#data-processing)
   - [Performance](#performance-optimization)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

## Setup Guide

1. **Install Dependencies**:

```bash
pnpm install @tremor/react framer-motion swr
```

2. **Configure Environment**:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_CACHE_DURATION=300
```

3. **Import Required Components**:

```typescript
import { useCommunityData } from '@/hooks/useCommunityData';
import { CommunityMetrics } from '@/types/community';
import { BaseChart, SentimentChart } from '@/components/charts';
```

## Features & Implementation

### Performance Optimizations

#### Data Fetching Strategy

```typescript
// hooks/useCommunityData.ts
export function useCommunityData(options: DataOptions = {}) {
  const { platform = 'all', timeRange = '24h', forceRefresh = false } = options;

  return useSWR(['/api/community/metrics', platform, timeRange], fetchWithCache, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    fallbackData: getCachedData(platform, timeRange),
  });
}
```

#### Optimized Rendering

```typescript
// components/charts/CommunityChart.tsx
export function CommunityChart({ data }: Props) {
  // Memoize expensive calculations
  const processedData = useMemo(
    () => processChartData(data),
    [data]
  );

  // Prevent unnecessary re-renders
  const ChartComponent = useMemo(
    () => (
      <BaseChart
        data={processedData}
        options={chartOptions}
      />
    ),
    [processedData]
  );

  return (
    <ErrorBoundary fallback={<ChartError />}>
      <Suspense fallback={<ChartSkeleton />}>
        {ChartComponent}
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Data Visualization

#### Chart Configuration

```typescript
// config/chartConfig.ts
export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 400,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'rgba(255, 255, 255, 0.9)',
      bodyColor: 'rgba(255, 255, 255, 0.7)',
      borderColor: 'rgba(135, 250, 253, 0.2)',
      borderWidth: 1,
    },
  },
};
```

#### Accessibility Support

```typescript
// components/charts/BaseChart.tsx
export function BaseChart({ data, options, ...props }: BaseChartProps) {
  return (
    <div
      role="region"
      aria-label={props.title}
      className="chart-container"
    >
      <div className="chart-header">
        <h2 id={`${props.id}-title`}>{props.title}</h2>
        {props.description && (
          <p id={`${props.id}-desc`}>{props.description}</p>
        )}
      </div>
      <div
        role="img"
        aria-labelledby={`${props.id}-title`}
        aria-describedby={`${props.id}-desc`}
      >
        <Chart
          data={data}
          options={{
            ...chartOptions,
            ...options,
            plugins: {
              ...chartOptions.plugins,
              accessibility: {
                enabled: true,
                announceOnRender: true
              }
            }
          }}
        />
      </div>
    </div>
  );
}
```

### Skeleton Loaders

The community analytics dashboard implements skeleton loaders for individual chart components to improve the perceived performance and user experience. Each chart component has its own dedicated skeleton loader that appears while the specific data for that chart is being fetched.

Key features of the skeleton loaders:

- Independent loading states for each chart
- Smooth animations and transitions
- Visual representation matching the actual chart layout
- Consistent styling with the dashboard theme

Example usage:

```tsx
import { SentimentChartSkeleton } from '@/components/charts/SentimentChartSkeleton';

function MyComponent() {
  const { sentiment, isSentimentLoading } = useCommunityData('community-id');

  return (
    <div>
      {isSentimentLoading ? <SentimentChartSkeleton /> : <SentimentChart data={sentiment} />}
    </div>
  );
}
```

### Troubleshooting Skeleton Loaders

Common issues and solutions:

1. Skeletons not appearing:

   - Verify that the loading state is properly set in useCommunityData
   - Check that the skeleton component is properly imported
   - Ensure the conditional rendering logic is correct

2. Incorrect loading states:

   - Check that the loading states in useCommunityData are being updated correctly
   - Verify that the API calls are properly setting and clearing loading states
   - Ensure error states are being handled appropriately

3. Styling inconsistencies:
   - Confirm that the skeleton components are using the correct theme variables
   - Check that the skeleton dimensions match the actual chart components
   - Verify that the animation classes are being applied correctly

## Common Tasks

### 1. Add a New Metric

```typescript
// 1. Add type definition
interface NewMetric {
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

// 2. Update API response type
interface CommunityMetrics {
  // ... existing metrics
  newMetric: NewMetric;
}

// 3. Add to UI
function MetricCard({ metric }: { metric: NewMetric }) {
  return (
    <Card className="metric-card">
      <MetricValue value={metric.value} />
      <TrendIndicator
        trend={metric.trend}
        change={metric.change}
      />
    </Card>
  );
}
```

### 2. Implement Data Export

```typescript
async function exportData(timeRange: string) {
  const data = await fetchCommunityData(timeRange);
  const csv = convertToCSV(data);

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `community-data-${timeRange}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

## Troubleshooting

### Common Issues

1. **Charts Not Rendering or Showing "No Data"**

   - **Symptoms**:
     - Empty charts
     - "No Data" placeholder
     - Blank spaces where charts should be
   - **Solutions**:

     ```typescript
     // 1. Check API configuration
     console.log(process.env.NEXT_PUBLIC_API_BASE_URL); // Should match your API

     // 2. Verify data availability
     const { data, error } = useCommunityData();
     console.log('Data:', data, 'Error:', error);

     // 3. Check time range validity
     const validTimeRanges = ['24h', '7d', '30d', '90d'];
     if (!validTimeRanges.includes(timeRange)) {
       console.error('Invalid time range:', timeRange);
     }
     ```

   - **Prevention**:
     - Always validate environment variables during setup
     - Implement proper loading states
     - Add data validation before rendering

2. **Infinite Loading States**

   - **Symptoms**:
     - Perpetual loading spinner
     - No error messages
     - UI stuck in loading state
   - **Solutions**:

     ```typescript
     // 1. Add timeout to useSWR
     const { data, error } = useSWR(key, fetcher, {
       dedupingInterval: 60000,
       loadingTimeout: 10000,
       onLoadingSlow: () => {
         console.warn('Slow loading detected');
       }
     });

     // 2. Implement error boundaries
     <ErrorBoundary fallback={<ErrorMessage />}>
       <CommunityChart data={data} />
     </ErrorBoundary>
     ```

   - **Prevention**:
     - Set appropriate timeouts
     - Implement loading fallbacks
     - Add error boundaries

3. **Data Not Updating with Filters**

   - **Symptoms**:
     - Stale data after filter changes
     - Inconsistent updates
     - Missing data for certain filters
   - **Solutions**:

     ```typescript
     // 1. Verify dependency array
     useEffect(() => {
       refetch(); // Trigger manual refetch
     }, [timeRange, platform]); // Include all filter dependencies

     // 2. Clear cache when needed
     const handleFilterChange = () => {
       mutate(null); // Clear cache
       setTimeRange(newRange);
     };

     // 3. Debug rerender triggers
     console.log('Render:', { timeRange, platform, data });
     ```

   - **Prevention**:
     - Properly manage dependencies
     - Implement proper cache invalidation
     - Add logging for debugging

4. **Performance Issues**

   - **Symptoms**:
     - Slow chart updates
     - UI lag when filtering
     - High memory usage
   - **Solutions**:

     ```typescript
     // 1. Implement data sampling
     const sampledData = useMemo(() => {
       if (data.length > 1000) {
         return data.filter((_, i) => i % 4 === 0);
       }
       return data;
     }, [data]);

     // 2. Optimize rerenders
     const MemoizedChart = memo(CommunityChart);

     // 3. Use windowing for large lists
     import { VirtualList } from '@/components/VirtualList';
     ```

   - **Prevention**:
     - Monitor performance metrics
     - Implement data sampling
     - Use virtualization for lists

## Contributing

### Development Workflow

1. **Setup**

   ```bash
   git checkout -b feature/new-metric
   pnpm install
   pnpm dev
   ```

2. **Testing**

   ```bash
   pnpm test
   pnpm test:coverage
   ```

3. **Documentation**

   - Update relevant .md files
   - Add JSDoc comments
   - Include code examples
   - Update changelog

4. **Pull Request**
   - Follow PR template
   - Include screenshots/videos
   - Add test coverage
   - Update documentation

## Maintenance Guidelines

### Documentation Updates

1. **When to Update**:

   - Adding new features or components
   - Modifying existing functionality
   - Fixing bugs that affect usage
   - Updating dependencies
   - Adding new best practices

2. **Review Process**:

   - Documentation changes require PR review
   - Include screenshots/videos for visual changes
   - Update all affected documentation files
   - Run spell-checker and grammar checker
   - Verify all code examples are working
   - Update version numbers and changelog

3. **Quality Checklist**:

   - [ ] Code examples are complete and runnable
   - [ ] All imports are specified
   - [ ] Type definitions are included
   - [ ] Examples follow project code style
   - [ ] Links are valid and up-to-date
   - [ ] Screenshots match current UI
   - [ ] Changelog is updated
   - [ ] Version numbers are correct

4. **Regular Maintenance**:
   - Assign documentation owner for each sprint
   - Schedule quarterly documentation audits
   - Review and update troubleshooting section
   - Verify all examples with latest dependencies
   - Update performance recommendations
   - Refresh screenshots and examples

## Mock Data Generation

### Hourly Activity Configuration

The mock data generation system supports detailed configuration of hourly activity patterns through the API. This is particularly useful for testing and development.

```typescript
interface HourlyActivityConfig {
  timezone?: string; // e.g., 'America/New_York'
  activityRanges?: {
    messages: { min: number; max: number };
    reactions: { min: number; max: number };
    threads: { min: number; max: number };
  };
  peakHours?: {
    weekday: number[]; // Array of peak hours (0-23)
    weekend: number[]; // Array of peak hours (0-23)
  };
  activityMultipliers?: {
    night: number; // 00:00-06:59
    morning: number; // 07:00-08:59
    peak: number; // Peak hours
    evening: number; // 18:00-23:59
  };
  dayOfWeekVariations?: {
    weekday: number; // Base multiplier for weekdays
    weekend: number; // Base multiplier for weekends
  };
  eventSimulation?: {
    probability: number; // 0-1
    magnitude: number; // 1-5
    duration: number; // 1-4 hours
    types: ('ama' | 'launch' | 'announcement' | 'incident')[];
  };
  seed?: number; // For reproducible generation
}
```

### Example Usage

```typescript
// Basic usage with default configuration
const response = await fetch('/api/community');
const data = await response.json();

// Custom configuration
const config = {
  timezone: 'America/New_York',
  peakHours: {
    weekday: [10, 11, 12, 13, 14],
    weekend: [14, 15, 16, 17],
  },
  eventSimulation: {
    probability: 0.2,
    magnitude: 2.5,
    duration: 2,
    types: ['ama', 'launch'],
  },
};

const response = await fetch(
  '/api/community?' +
    new URLSearchParams({
      hourlyActivityConfig: JSON.stringify(config),
    })
);
const data = await response.json();
```

### Error Handling

The API provides detailed error messages for invalid configurations:

```typescript
// Invalid configuration example
const invalidConfig = {
  activityRanges: {
    messages: { min: 100, max: 50 } // Invalid: min > max
  }
};

// API will return a 400 error with details:
{
  error: "Invalid hourlyActivityConfig: Validation failed",
  details: {
    errors: ["Messages range: minimum must be less than maximum"],
    providedConfig: invalidConfig
  }
}
```

### Best Practices

1. **Activity Ranges**

   - Keep ranges realistic (e.g., threads < messages)
   - Maintain logical relationships between metrics
   - Use appropriate ranges for your community size

2. **Time-based Configuration**

   - Set peak hours based on your community's timezone
   - Adjust multipliers for your activity patterns
   - Consider weekday/weekend variations

3. **Event Simulation**

   - Use realistic event probabilities
   - Set appropriate event durations
   - Choose relevant event types

4. **Data Validation**
   - Always validate configuration before sending
   - Handle API errors gracefully
   - Log validation failures for debugging
