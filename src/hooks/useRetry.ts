import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
}

interface RetryResult<T> {
  execute: () => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
  state: RetryState;
}

/**
 * Custom hook for retry functionality with exponential backoff
 * @param asyncFunction The async function to retry
 * @param options Retry configuration options
 */
export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: UseRetryOptions = {}
): RetryResult<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
  });

  const calculateDelay = useCallback((attempt: number): number => {
    const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
    // Add some jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }, [baseDelay, backoffFactor, maxDelay]);

  const sleep = useCallback((ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  const execute = useCallback(async (): Promise<T | null> => {
    setState(prev => ({ ...prev, isRetrying: true, lastError: null }));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFunction();
        setState({
          isRetrying: false,
          retryCount: attempt,
          lastError: null,
        });
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        
        setState(prev => ({
          ...prev,
          retryCount: attempt,
          lastError: err,
        }));

        // If this was the last attempt, don't wait
        if (attempt === maxRetries) {
          setState(prev => ({ ...prev, isRetrying: false }));
          console.error(`Failed after ${maxRetries + 1} attempts:`, err);
          throw err;
        }

        // Wait before retrying (with exponential backoff)
        const delay = calculateDelay(attempt);
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, err.message);
        await sleep(delay);
      }
    }

    setState(prev => ({ ...prev, isRetrying: false }));
    return null;
  }, [asyncFunction, maxRetries, calculateDelay, sleep]);

  const retry = useCallback(async (): Promise<T | null> => {
    // Reset retry count for manual retry
    setState(prev => ({ ...prev, retryCount: 0 }));
    return execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
    });
  }, []);

  return {
    execute,
    retry,
    reset,
    state,
  };
}

/**
 * Utility function to check if an error is retryable
 * @param error The error to check
 * @returns True if the error should be retried
 */
export function isRetryableError(error: Error): boolean {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }

  // Timeout errors
  if (error.message.includes('timeout')) {
    return true;
  }

  // Rate limiting (429) - should be retried with backoff
  if (error.message.includes('429')) {
    return true;
  }

  // Server errors (5xx) - should be retried
  if (error.message.includes('500') || 
      error.message.includes('502') || 
      error.message.includes('503') || 
      error.message.includes('504')) {
    return true;
  }

  // Client errors (4xx) generally shouldn't be retried
  if (error.message.includes('400') || 
      error.message.includes('401') || 
      error.message.includes('403') || 
      error.message.includes('404')) {
    return false;
  }

  // Unknown errors - be conservative and retry
  return true;
}

export default useRetry;
