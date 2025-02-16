import { useState, useCallback } from 'react';

interface UseHighlightResetReturn {
  isHighlighted: boolean;
  highlight: () => void;
  reset: () => void;
}

export function useHighlightReset(duration: number = 2000): UseHighlightResetReturn {
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  const highlight = useCallback(() => {
    setIsHighlighted(true);
  }, []);

  const reset = useCallback(() => {
    setIsHighlighted(false);
  }, []);

  // Auto-reset after duration if not manually reset
  const handleHighlight = useCallback(() => {
    highlight();
    const timer = setTimeout(reset, duration);
    return () => clearTimeout(timer);
  }, [duration, highlight, reset]);

  return {
    isHighlighted,
    highlight: handleHighlight,
    reset
  };
} 