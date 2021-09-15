import React, { createContext, useContext } from 'react';
import {
  useCreateTripRequestMutation,
  useDeleteTripRequestMutation,
  useGetTripRequestsQuery,
} from '../generated/graphql';

interface TripRequestInterface {
  createTrip: ({}) => void;
  deleteTripRequest: (id: number) => void;
  editTripRequest: (id: number) => void;

  errorTripRequests: Error | null;
  loadingTripRequests: boolean;
  tripRequestsData: {
    getTripRequests: {
      tripRequests: [];
    };
  } | null;
  refetchTripRequests: () => void;
}

const initialState: TripRequestInterface = {
  createTrip: () => {},
  deleteTripRequest: () => {},
  editTripRequest: () => {},
  errorTripRequests: null,
  loadingTripRequests: false,
  tripRequestsData: null,
  refetchTripRequests: () => {},
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

  const {
    data: tripRequestsData,
    loading: loadingTripRequests,
    error: errorTripRequests,
    refetch: refetchTripRequests,
  } = useGetTripRequestsQuery();

  const [
    deleteTripRequestMutation,
    { data: deletingTripRequestResponse, loading: deletingTripRequest, error },
  ] = useDeleteTripRequestMutation();

  const createTrip = async (tr) => {
    await createTripMutation({ variables: { input: tr } });
    refetchTripRequests();
  };

  const deleteTripRequest = async (id) => {
    await deleteTripRequestMutation({ variables: { id } });
    refetchTripRequests();
  };

  const editTripRequest = () => {};

  const value = {
    createTrip,
    deleteTripRequest,
    editTripRequest,
    errorTripRequests,
    loadingTripRequests,
    tripRequestsData,
    refetchTripRequests,
  };
  return <TripRequestsContext.Provider value={value} {...props} />;
}
export { TripRequestsProvider, useTripRequests };
