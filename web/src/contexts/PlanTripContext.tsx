import React, { createContext, useContext, useRef, useState } from 'react';

interface PlanTripContextInterface {
  hasSearched: boolean;
  setSummarySelected: (boolean) => void;
  setTabIndex: (number) => void;
  summarySelected: boolean;
  tabIndex: 0 | 1 | 2;
  tabRef: React.MutableRefObject<number>;
  toggleSearched: (boolean) => void;
}

const intialState: PlanTripContextInterface = {
  hasSearched: false,
  setSummarySelected: (val) => {},
  setTabIndex: (val) => {},
  tabIndex: 0,
  tabRef: { current: 0 },
  summarySelected: false,
  toggleSearched: (val) => {},
};

const PlanTripContext = createContext(intialState);

function usePlanTrip() {
  const context = useContext(PlanTripContext);
  if (!context) {
    throw new Error(`usePlanTrip must be used within a CountProvider`);
  }
  return context;
}

function PlanTripProvider(props) {
  const [summarySelected, setSummarySelected] = useState(false);
  const [hasSearched, toggleSearched] = useState(false);
  const [tabIndex, toggleTabIndex] = useState(0);
  const tabRef = useRef(0);

  const setTabIndex = (index) => {
    toggleTabIndex(index);
    tabRef.current = index;
  };

  const value = {
    hasSearched,
    setSummarySelected,
    setTabIndex,
    summarySelected,
    tabIndex,
    tabRef,
    toggleSearched,
  };
  return <PlanTripContext.Provider value={value} {...props} />;
}
export { PlanTripProvider, usePlanTrip };
