import { useCallback, useEffect, useReducer, useRef } from 'react';

export function useSetState(initialState) {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState
  );
  return [state, setState];
}

export function useSafeSetState(initialState) {
  const [state, setState] = useSetState(initialState);
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const safeSetState = useCallback(
    (...args) => mountedRef.current && setState(...args),
    [setState]
  );
  return [state, safeSetState];
}
