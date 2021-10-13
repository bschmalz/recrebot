import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  TripRequest,
  useCreateTripRequestMutation,
  useDeleteTripRequestMutation,
  useEditTripRequestMutation,
  useGetTripRequestsQuery,
} from '../generated/graphql';

type Trip = {
  min_nights?: number;
  dates: Date[];
  locations: number[];
  id: number;
  custom_name: string;
  type: string;
};

interface TripRequestInterface {
  createTrip: ({}) => void;
  customName: string;
  deleteTripRequest: (id: number) => void;
  editTripRequest: (input: {}) => void;
  editingTripRequest: TripRequest | null;
  errorTripRequests: Error | null;
  loadingTripRequests: boolean;
  tripRequests: Trip[];
  tripRequestsData: {
    getTripRequests: {
      tripRequests: [];
    };
  } | null;
  refetchTripRequests: () => void;
  setCustomName: (id: string) => void;
  setEditingTripRequest: (tr: {} | null) => void;
}

const initialState: TripRequestInterface = {
  createTrip: () => {},
  customName: '',
  deleteTripRequest: () => {},
  editTripRequest: () => {},
  editingTripRequest: null,
  errorTripRequests: null,
  loadingTripRequests: false,
  tripRequests: [],
  tripRequestsData: null,
  refetchTripRequests: () => {},
  setCustomName: (id) => {},
  setEditingTripRequest: (tr) => {},
};

const TripRequestsContext = createContext(initialState);

function useTripRequests() {
  const context = useContext(TripRequestsContext);
  if (!context) {
    throw new Error(`useTripRequests must be used within a CountProvider`);
  }
  return context;
}

function TripRequestsProvider(props) {
  const [createTripMutation] = useCreateTripRequestMutation();
  const [customName, setCustomName] = useState('');
  const [editingTripRequest, setEditingTripRequest] = useState(null);

  const {
    data: tripRequestsData,
    loading: loadingTripRequests,
    error: errorTripRequests,
    refetch: refetchTripRequests,
  } = useGetTripRequestsQuery();

  const checkVisibility = () => {
    // Check if our new state is visible
    if (document.visibilityState === 'visible') {
      // Try to make sure the current device is a phone with a pwa
      if (
        (navigator as any)?.standalone ||
        window.matchMedia('(display-mode: standalone)').matches
      ) {
        refetchTripRequests();
      }
    }
  };

  // Make sure we refresh trip requests on PWAs when they are reopened
  useEffect(() => {
    document.addEventListener('visibilitychange', checkVisibility);
    return () =>
      document.removeEventListener('visibilitychange', checkVisibility);
  }, []);

  const [
    deleteTripRequestMutation,
    { data: deletingTripRequestResponse, loading: deletingTripRequest },
  ] = useDeleteTripRequestMutation();

  const [
    editTripMutation,
    { data: editingTripRequestResponse, loading: loadingEditTripRequest },
  ] = useEditTripRequestMutation();

  const createTrip = async (tr) => {
    await createTripMutation({ variables: { input: tr } });
    refetchTripRequests();
  };

  const deleteTripRequest = async (id) => {
    await deleteTripRequestMutation({ variables: { id } });
    refetchTripRequests();
  };

  const editTripRequest = async (tr) => {
    await editTripMutation({ variables: { input: tr } });
    refetchTripRequests();
  };

  const tripRequests =
    tripRequestsData?.getTripRequests?.tripRequests?.map((tr) => ({
      ...tr,
      dates: tr.dates.map((d) => {
        return new Date(parseInt(d));
      }),
    })) || [];

  const value = {
    createTrip,
    customName,
    deleteTripRequest,
    editTripRequest,
    editingTripRequest,
    errorTripRequests,
    loadingTripRequests,
    tripRequests,
    tripRequestsData,
    refetchTripRequests,
    setCustomName,
    setEditingTripRequest,
  };
  return <TripRequestsContext.Provider value={value} {...props} />;
}
export { TripRequestsProvider, useTripRequests };
