import { ReactNode } from 'react';

/**
 * Available chart types in the application
 */
export type ChartType = 'bar' | 'area' | 'donut' | 'sentiment' | 'engagement' | 'members';

/**
 * Data structure for highlighting specific chart elements
 */
export interface HighlightedData {
  /** The type of data being highlighted */
  key: 'hour' | 'category' | 'period' | string;
  /** The value being highlighted */
  value: string | number;
}

/**
 * Data structure for chart-related insights
 */
export interface InsightRelatedData {
  /** Numeric trend indicator */
  trend?: number;
  /** Current growth rate */
  currentGrowth?: number;
  /** Detailed description */
  details?: string;
  /** Percentage change value */
  percentChange?: number;
  /** Benchmark information */
  benchmark?: {
    type: 'average' | 'previous' | 'target';
    value: number;
  };
  /** Contextual information */
  context?: string;
  /** Active ratio value */
  activeRatio?: number;
  /** Total member count */
  totalMembers?: number;
  /** Active member count */
  activeMembers?: number;
  /** New member count */
  newMembers?: number;
  /** Join dates information */
  joinDates?: string;
  /** Hour information */
  hour?: string;
  /** Total value */
  total?: number;
  /** Breakdown information */
  breakdown?: string;
  /** Type information */
  type?: string;
  /** Count value */
  count?: number;
  /** Percentage value as string */
  percentage?: string;
  /** Average activity value */
  avgActivity?: number;
}

/**
 * Chart insight type with related data and highlighting
 */
export interface InsightType {
  /** Main insight text */
  text: string;
  /** Priority level of the insight */
  priority?: 'low' | 'medium' | 'high';
  /** Suggested action based on the insight */
  action?: string;
  /** Whether the insight can be expanded */
  isExpandable?: boolean;
  /** Additional data related to the insight */
  relatedData?: InsightRelatedData;
  /** Data to highlight when insight is selected */
  highlightData?: HighlightedData;
  /** Related charts for cross-referencing */
  relatedCharts?: Array<{
    chartId: string;
    insight?: string;
    chartType?: ChartType;
    color?: string;
  }>;
}

/**
 * Value formatter function type
 */
export type ValueFormatter = (value: number) => string;

/**
 * Base props shared by all chart components
 */
export interface BaseChartProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Chart content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel: string;
  /** Optional content to display on the right side */
  rightContent?: ReactNode;
  /** Last updated timestamp */
  lastUpdated?: Date;
  /** Array of insights related to the chart */
  insights?: InsightType[];
  /** Callback when an insight is clicked */
  onInsightClick?: (insight: InsightType | null) => void;
  /** Unique identifier for the chart */
  chartId?: string;
  /** Currently highlighted data */
  highlightedData?: HighlightedData;
  /** Function to format values in the chart */
  valueFormatter?: ValueFormatter;
}

/**
 * Base props for sentiment-related charts
 */
export interface BaseSentimentChartProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Callback when highlighted data changes */
  onHighlightChange?: (highlight: HighlightedData | null) => void;
  /** Currently highlighted data */
  highlightedData?: HighlightedData;
  /** Unique identifier for the chart */
  chartId?: string;
}

/**
 * Props for the SentimentChart component
 */
export interface SentimentChartProps extends BaseSentimentChartProps {
  /** Time series sentiment data */
  data: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
  /** Selected time range for the chart */
  selectedRange?: string;
}

/**
 * Props for the CurrentSentimentChart component
 */
export interface CurrentSentimentChartProps extends BaseSentimentChartProps {
  /** Current sentiment distribution data */
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
}
