import React, { createContext, useContext, useRef, useState } from 'react';
import { useMain } from './MainContext';
import { useSelectedPlaces } from './SelectedPlacesContext';

interface TripTypeContextInterface {
  tripType: string;
  tripTypeRef: any;
  setTripType: Function;
}

const TripTypeContext = createContext({
  tripType: 'Camp',
  tripTypeRef: { current: {} },
  setTripType: (tt: string) => {},
});

function useTripType() {
  const context = useContext(TripTypeContext);
  if (!context) {
    throw new Error(`useTripType must be used within a CountProvider`);
  }
  return context;
}

function TripTypeProvider(props) {
  const [tripType, updateTripType] = useState('Camp');
  const tripTypeRef = useRef('Camp');

  const setTripType = (tt: string) => {
    updateTripType(tt);
    tripTypeRef.current = tt;
  };

  const value = {
    tripType,
    tripTypeRef,
    setTripType,
  };
  return <TripTypeContext.Provider value={value} {...props} />;
}
export { TripTypeProvider, useTripType };
