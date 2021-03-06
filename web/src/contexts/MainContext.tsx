import React, { createContext, useContext, useRef, useState } from 'react';

interface MainContextInterface {
  searchText: string;
  searchTextRef: React.MutableRefObject<string>;
  setSearchText: (val: string) => void;
  setSideBarView: (val: string) => void;
  sideBarView: 'MyTrips' | 'PlanATrip';
  sideBarRef: React.MutableRefObject<HTMLDivElement | null>;
  scrollRef: React.MutableRefObject<number>;
  sideBarViewRef: React.MutableRefObject<string>;
}

const initialValue: MainContextInterface = {
  searchText: '',
  searchTextRef: { current: '' },
  setSearchText: (val) => {},
  setSideBarView: (val) => {},
  sideBarView: 'MyTrips',
  scrollRef: { current: 0 },
  sideBarRef: { current: null },
  sideBarViewRef: { current: 'MyTrips' },
};

const MainContext = createContext(initialValue);

function useMain() {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error(`useMain must be used within a CountProvider`);
  }
  return context;
}

function MainProvider(props) {
  const [sideBarView, toggleSideBarView] = useState('MyTrips');
  const [searchText, setSearchText] = useState('');

  const searchTextRef = useRef('');
  const sideBarViewRef = useRef('MyTrips');

  const sideBarRef = useRef(null);
  const scrollRef = useRef(0);
  const setSideBarView = (val) => {
    toggleSideBarView(val);
    sideBarViewRef.current = val;
  };
  const value = {
    searchText,
    searchTextRef,
    setSearchText,
    setSideBarView,
    sideBarView,
    sideBarRef,
    sideBarViewRef,
    scrollRef,
  };
  return <MainContext.Provider value={value} {...props} />;
}
export { MainProvider, useMain };
function MutableRefObject<T>() {
  throw new Error('Function not implemented.');
}
