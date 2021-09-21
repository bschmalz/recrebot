import React, { createContext, useContext, useState } from 'react';

const TripTypeContext = createContext({ tripType: 'Camp' });

function useTripType() {
  const context = useContext(TripTypeContext);
  if (!context) {
    throw new Error(`useTripType must be used within a CountProvider`);
  }
  return context;
}

function TripTypeProvider(props) {
  const [tripType, setTripType] = useState('Camp');

  const value = {
    tripType,
    setTripType,
  };
  return <TripTypeContext.Provider value={value} {...props} />;
}
export { TripTypeProvider, useTripType };
