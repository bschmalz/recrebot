import React, { createContext, useContext, useRef, useState } from 'react';
import { useMeQuery } from '../generated/graphql';

interface MeInterface {
  data: { me?: { email: string; id: string } } | undefined;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

const initialState: MeInterface = {
  data: {},
  error: null,
  loading: false,
  refetch: () => {},
};

const MeContext = createContext(initialState);

function useMe() {
  const context = useContext(MeContext);
  if (!context) {
    throw new Error(`useMe must be used within a CountProvider`);
  }
  return context;
}

function MeProvider(props) {
  const { data, error, loading, refetch } = useMeQuery();

  const value = {
    data,
    error,
    loading,
    refetch,
  };
  return <MeContext.Provider value={value} {...props} />;
}
export { MeProvider, useMe };
