/**
 * Formats numeric values for display in charts and tooltips
 * @param value The value to format
 * @param dataKey The type of data being formatted (e.g., 'messages', 'members', etc.)
 * @returns Formatted string value
 */
export function formatValue(value: number | string, dataKey?: string): string {
  // Convert string numbers to numbers
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Handle percentage values
  if (typeof dataKey === 'string' && dataKey.toLowerCase().includes('percent')) {
    return `${numValue.toFixed(1)}%`;
  }

  // Handle large numbers
  if (typeof numValue === 'number') {
    if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}M`;
    }
    if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    }
    // Handle decimal numbers
    if (numValue % 1 !== 0) {
      return numValue.toFixed(1);
    }
    return numValue.toLocaleString();
  }

  // Return original value if no formatting rules apply
  return String(value);
}

/**
 * Format a date to a readable string
 * @param input Date string or Date object
 */
export const formatDate = (input: string | Date | undefined): string => {
  if (!input) return 'N/A';

  try {
    const date = typeof input === 'string' ? new Date(input) : input;

    // Validate the date
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Invalid date:', input);
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
