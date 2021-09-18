import React, { createContext, useContext } from 'react';
import {
  Reservable,
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
};

interface TripRequestInterface {
  createTrip: ({}) => void;
  deleteTripRequest: (id: number) => void;
  editTripRequest: (input: Trip) => void;

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
    { data: deletingTripRequestResponse, loading: deletingTripRequest },
  ] = useDeleteTripRequestMutation();

  const [
    editTripMutation,
    { data: editingTripRequestResponse, loading: editingTripRequest },
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
