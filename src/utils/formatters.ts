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
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};
