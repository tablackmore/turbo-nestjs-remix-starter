import { useCallback, useState, useTransition } from 'react';

interface AsyncActionState<T = unknown> {
  data: T | null;
  error: string | null;
  isPending: boolean;
}

interface AsyncActionResult<T = unknown> {
  state: AsyncActionState<T>;
  execute: (actionFn: () => Promise<T>) => Promise<void>;
  reset: () => void;
}

/**
 * React 19 custom hook for handling async actions with automatic state management
 * Uses React 19's useTransition for better concurrent rendering
 */
export function useAsyncAction<T = unknown>(initialData: T | null = null): AsyncActionResult<T> {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<Omit<AsyncActionState<T>, 'isPending'>>({
    data: initialData,
    error: null,
  });

  const execute = useCallback(async (actionFn: () => Promise<T>) => {
    startTransition(async () => {
      try {
        setState((prev) => ({ ...prev, error: null }));
        const result = await actionFn();
        setState((prev) => ({ ...prev, data: result }));
      } catch (error) {
        console.error('Async action failed:', error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      error: null,
    });
  }, [initialData]);

  return {
    state: {
      ...state,
      isPending,
    },
    execute,
    reset,
  };
}

/**
 * React 19 hook for handling multiple async actions with individual states
 */
export function useAsyncActions<_T extends Record<string, unknown>>() {
  const [isPending, startTransition] = useTransition();
  const [states, setStates] = useState<Record<string, AsyncActionState>>({});

  const executeAction = useCallback(async (key: string, actionFn: () => Promise<unknown>) => {
    startTransition(async () => {
      try {
        setStates((prev) => ({
          ...prev,
          [key]: { ...prev[key], error: null, isPending: true },
        }));

        const result = await actionFn();

        setStates((prev) => ({
          ...prev,
          [key]: { data: result, error: null, isPending: false },
        }));
      } catch (error) {
        console.error(`Action ${key} failed:`, error);
        setStates((prev) => ({
          ...prev,
          [key]: {
            data: null,
            error: error instanceof Error ? error.message : 'An error occurred',
            isPending: false,
          },
        }));
      }
    });
  }, []);

  const resetAction = useCallback((key: string) => {
    setStates((prev) => ({
      ...prev,
      [key]: { data: null, error: null, isPending: false },
    }));
  }, []);

  return {
    states,
    executeAction,
    resetAction,
    isAnyPending: isPending,
  };
}

/**
 * React 19 pattern for handling form submissions with optimistic updates
 */
export function useOptimisticAction<T>(
  initialData: T[],
  optimisticUpdate: (data: T[], optimisticValue: unknown) => T[],
) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<string | null>(null);

  const executeOptimistic = useCallback(
    async (optimisticValue: unknown, actionFn: () => Promise<T[]>) => {
      // Store backup of original data before applying optimistic update
      const backupData = data;

      // Apply optimistic update immediately
      const optimisticData = optimisticUpdate(data, optimisticValue);
      setData(optimisticData);
      setError(null);

      startTransition(async () => {
        try {
          const result = await actionFn();
          setData(result);
        } catch (error) {
          console.error('Optimistic action failed:', error);
          // Revert to the backed-up original state
          setData(backupData);
          setError(error instanceof Error ? error.message : 'An error occurred');
        }
      });
    },
    [data, optimisticUpdate],
  );

  return {
    data,
    error,
    isPending,
    executeOptimistic,
  };
}
