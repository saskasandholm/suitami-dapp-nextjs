'use client';

import { Text } from '@tremor/react';
import { ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface LoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  noData: boolean;
  onRetry: () => void;
}

export function LoadingState({ isLoading, error, noData, onRetry }: LoadingStateProps) {
  if (noData) {
    return (
      <div className="flex items-center justify-center h-72" role="status">
        <Text className="text-white/70">No data available for selected time range</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="alert">
        <div className="text-center">
          <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <Text className="text-white mb-4">
            {typeof error === 'string' ? error : 'An error occurred while loading data'}
          </Text>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-accent mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  return null;
}
