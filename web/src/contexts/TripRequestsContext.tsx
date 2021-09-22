import React, { createContext, useContext, useState } from 'react';
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
  type: string;
};

interface TripRequestInterface {
  createTrip: ({}) => void;
  customName: string;
  deleteTripRequest: (id: number) => void;
  editTripRequest: (input: Trip) => void;
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

  const setEditingTripRequest = (isEditing) => {
    setEditingTripRequest(isEditing);
  };

  const tripRequests = tripRequestsData?.getTripRequests?.tripRequests || [];

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
