import { useCallback, useRef, useState } from "react";

/**
 * A hook that wraps an async action with loading state.
 *
 * @example
 * const { isLoading, execute } = useAsyncAction();
 * <Button onClick={() => execute(async () => { await doSomething(); })}>
 *   {isLoading ? <Loader2 className="animate-spin" /> : "Action"}
 * </Button>
 */
export function useAsyncAction<TArgs extends any[] = any[], TReturn = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const pendingRef = useRef<Promise<TReturn> | null>(null);

  const execute = useCallback(
    async (action: (...args: TArgs) => Promise<TReturn>, ...args: TArgs): Promise<TReturn | undefined> => {
      if (isLoading) return undefined;
      setIsLoading(true);
      try {
        const result = await action(...args);
        return result;
      } catch (error) {
        throw error;
      } finally {
        // Only clear if this was the last pending action
        if (pendingRef.current) {
          pendingRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  // Keep track of the current promise to prevent re-entry
  const executeWithGuard = useCallback(
    async (action: (...args: TArgs) => Promise<TReturn>, ...args: TArgs): Promise<TReturn | undefined> => {
      if (isLoading) return undefined;
      const promise = action(...args);
      pendingRef.current = promise;
      setIsLoading(true);
      try {
        return await promise;
      } finally {
        if (pendingRef.current === promise) {
          pendingRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  return { isLoading, execute: executeWithGuard };
}
