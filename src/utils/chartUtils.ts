import { Color } from '@tremor/react';

/** Utility types for color class generation */
export type ColorUtility = 'bg' | 'stroke' | 'fill' | 'text';

/** Priority level type for insights */
export type InsightPriority = 'high' | 'medium' | 'low';

/**
 * Get styles for different priority levels
 * @param priority - Priority level of the insight
 * @returns Object containing background and text color classes
 */
export const getPriorityStyles = (priority?: InsightPriority) => {
  switch (priority) {
    case 'high':
      return {
        bg: 'bg-rose-400/10 hover:bg-rose-400/20',
        text: 'text-rose-400',
      };
    case 'medium':
      return {
        bg: 'bg-amber-400/10 hover:bg-amber-400/20',
        text: 'text-amber-400',
      };
    case 'low':
    default:
      return {
        bg: 'bg-emerald-400/10 hover:bg-emerald-400/20',
        text: 'text-emerald-400',
      };
  }
};

/**
 * Chart color mapping using Tremor's color palette.
 * Maps semantic color names to Tremor color values.
 */
export const chartColors: { [key: string]: Color } = {
  positive: 'emerald',
  neutral: 'slate',
  negative: 'rose',
  blue: 'blue',
  cyan: 'cyan',
  violet: 'violet',
  amber: 'amber',
  gray: 'gray',
  pink: 'pink',
  lime: 'lime',
  fuchsia: 'fuchsia',
};

/** Type for available chart color keys */
export type AvailableChartColorsKeys = keyof typeof chartColors;

/** Array of available chart colors for easy iteration */
export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors
) as Array<AvailableChartColorsKeys>;

/**
 * Creates a mapping between categories and colors for consistent chart coloring.
 * @param categories - Array of category names to map to colors
 * @param colors - Array of color keys to use for mapping
 * @returns Map of categories to their assigned colors
 */
export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[]
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

/**
 * Generates a Tailwind CSS class name for a given color and utility type.
 * @param color - The color key from chartColors
 * @param type - The type of utility class (bg, stroke, fill, text)
 * @returns Tailwind CSS class name
 */
export const getColorClassName = (color: AvailableChartColorsKeys, type: ColorUtility): string => {
  const fallbackColor = {
    bg: 'bg-gray-500',
    stroke: 'stroke-gray-500',
    fill: 'fill-gray-500',
    text: 'text-gray-500',
  };
  return chartColors[color] ? `${type}-${chartColors[color]}-500` : fallbackColor[type];
};

/**
 * Determines Y-axis domain based on provided parameters.
 * @param autoMinValue - Whether to automatically determine minimum value
 * @param minValue - Optional minimum value for Y-axis
 * @param maxValue - Optional maximum value for Y-axis
 * @returns Array containing min and max domain values
 */
export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined
) => {
  const minDomain = autoMinValue ? 'auto' : (minValue ?? 0);
  const maxDomain = maxValue ?? 'auto';
  return [minDomain, maxDomain];
};

/**
 * Checks if an array of objects has only one unique value for a given key.
 * @param array - Array of objects to check
 * @param keyToCheck - Key to check for unique values
 * @returns Boolean indicating if only one unique value exists
 */
export const hasOnlyOneValueForKey = (array: any[], keyToCheck: string): boolean => {
  const uniqueValues = new Set(array.map(obj => obj[keyToCheck]));
  return uniqueValues.size === 1;
};

/**
 * Formats numbers using US locale.
 * @param number - Number to format
 * @returns Formatted string
 */
export const valueFormatter = (number: number): string => {
  return Intl.NumberFormat('us').format(number).toString();
};

/**
 * Formats numbers as percentages.
 * @param number - Number to format as percentage
 * @returns Formatted percentage string
 */
export const percentageFormatter = (number: number): string => {
  return `${Intl.NumberFormat('us').format(number).toString()}%`;
};

/**
 * Formats dates in a consistent, readable format.
 * @param date - Date to format
 * @returns Formatted date string
 */
export const dateFormatter = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

/**
 * Formats tooltip values with appropriate precision.
 * @param value - Number to format for tooltip display
 * @returns Formatted string with up to 2 decimal places
 */
export const tooltipFormatter = (value: number): string => {
  return Intl.NumberFormat('us', {
    maximumFractionDigits: 2,
  }).format(value);
};
