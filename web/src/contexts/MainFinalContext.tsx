import { useMediaQuery } from '@chakra-ui/react';
import React, { createContext, useContext, useRef, useState } from 'react';
import { useMain } from './MainContext';
import { useMap } from './MapContext';
import { useSearchLocations } from './SearchLocationsContext';
import { useSelectedPlaces } from './SelectedPlacesContext';
import { useTripRequests } from './TripRequestsContext';
import { useTripType } from './TripTypeContext';

interface MainFinalContextInterface {
  handlePlanTripChange: (val: boolean) => void;
  handleSearch: (val: string, type: {}) => void;
  toggleTripType: (val: string) => void;
  resetSelections: () => void;
}

const initialValue: MainFinalContextInterface = {
  handlePlanTripChange: (val: boolean) => {},
  handleSearch: (val, val2) => {},
  toggleTripType: (val) => {},
  resetSelections: () => {},
};

const MainFinalContext = createContext(initialValue);

function useMainFinal() {
  const context = useContext(MainFinalContext);
  if (!context) {
    throw new Error(`useMainFinal must be used within a CountProvider`);
  }
  return context;
}

function MainFinalProvider(props) {
  const [shouldRenderMap] = useMediaQuery('(min-width: 700px)');

  const { tripType, setTripType } = useTripType();
  const { campgrounds, trailheads, campgroundData, trailheadData } =
    useSearchLocations();
  const {
    selectedPlaces,
    resetSelectedPlaces,
    setDates,
    selectCard,
    setSelectedPlaces,
  } = useSelectedPlaces();
  const { campgroundSearch, trailheadSearch } = useSearchLocations();
  const { setCustomName, setEditingTripRequest } = useTripRequests();
  const { filterOnMapRef, map, updateMapMarkers } = useMap();
  const { searchText, sideBarView, setSearchText } = useMain();

  const handleSearch = (val, type) => {
    let center, bounds;
    if (shouldRenderMap) {
      center = JSON.stringify(map.current.getCenter());
      bounds = JSON.stringify(map.current.getBounds());
    }

    const callback =
      type === 'Camp' ? campgroundSearch.current : trailheadSearch.current;
    callback({
      variables: {
        searchTerm: val,
        mapCenter: center,
        mapBounds: bounds,
        filterOnBounds: filterOnMapRef.current,
      },
    });
  };

  const handlePlanTripChange = (showSelected) => {
    if (showSelected) {
      updateMapMarkers(selectedPlaces);
    } else {
      const markers = tripType === 'Camp' ? campgrounds : trailheads;
      updateMapMarkers(markers);
    }
  };

  const resetSelections = () => {
    setSearchText('');
    setCustomName('');
    setDates([]);
    setEditingTripRequest(null);
    resetSelectedPlaces();
  };

  const setSidebar = (newView) => {
    if (newView !== sideBarView) {
      setSidebar(newView);
      resetSelections();
    }
  };

  const toggleTripType = (newTripType) => {
    if (newTripType !== tripType) {
      setTripType(newTripType);

      setSelectedPlaces([]);

      selectCard(null);

      const places =
        newTripType === 'Camp'
          ? campgroundData?.searchCampgrounds?.campgrounds || []
          : trailheadData?.searchTrailheads?.trailheads || [];

      updateMapMarkers(places);
      handleSearch(searchText, newTripType);
    }
  };
  const value = {
    handlePlanTripChange,
    handleSearch,
    toggleTripType,
    resetSelections,
  };
  return <MainFinalContext.Provider value={value} {...props} />;
}
export { MainFinalProvider, useMainFinal };
