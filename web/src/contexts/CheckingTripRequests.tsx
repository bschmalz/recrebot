import React, { createContext, useContext, useRef, useState } from 'react';

const CheckingTripRequestsContext = createContext({
  checking: false,
  setChecking: (val: boolean) => {},
});

function useCheckingTripRequests() {
  const context = useContext(CheckingTripRequestsContext);
  if (!context) {
    throw new Error(
      `useCheckingTripRequests must be used within a CountProvider`
    );
  }
  return context;
}

function CheckingTripRequestsProvider(props) {
  const [checking, setChecking] = useState(false);

  const value = {
    checking,
    setChecking,
  };
  return <CheckingTripRequestsContext.Provider value={value} {...props} />;
}
export { CheckingTripRequestsProvider, useCheckingTripRequests };
