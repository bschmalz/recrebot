import React, { createContext, useContext, useEffect, useRef } from 'react';
import {
  SearchCampgroundsQuery,
  SearchTrailheadsQuery,
  useSearchCampgroundsLazyQuery,
  useSearchTrailheadsLazyQuery,
} from '../generated/graphql';
import { debounce } from '../utils/debounce';
import { useSelectedPlaces } from './SelectedPlacesContext';
import { useTripType } from './TripTypeContext';
import { Reservable } from '../views/Main/types/Reservable';
import { useMap } from './MapContext';

interface SearchLocationsInterface {
  campgroundData: SearchCampgroundsQuery;
  campgrounds: Reservable[];
  errorCampgrounds: boolean;
  errorTrailheads: boolean;
  trailheadData: SearchTrailheadsQuery;
  trailheads: Reservable[];
  campgroundSearch: any;
  trailheadSearch: any;
  loadingCampgrounds: boolean;
  loadingTrailheads: boolean;
  checkMarker: (id: string) => void;
}

const initialState: SearchLocationsInterface = {
  campgroundData: { searchCampgrounds: { campgrounds: [] } },
  campgrounds: [],
  errorCampgrounds: false,
  errorTrailheads: false,
  checkMarker: (id) => {},
  trailheadData: { searchTrailheads: { trailheads: [] } },
  trailheads: [],
  trailheadSearch: {},
  campgroundSearch: {},
  loadingCampgrounds: false,
  loadingTrailheads: false,
};

const SearchLocationsContext = createContext(initialState);

function useSearchLocations() {
  const context = useContext(SearchLocationsContext);
  if (!context) {
    throw new Error(`useSearchLocations must be used within a CountProvider`);
  }
  return context;
}

function SearchLocationsProvider(props) {
  const { tripType } = useTripType();

  const { selectedPlacesObj } = useSelectedPlaces();

  const { updateMapMarkers } = useMap();

  const [
    searchCampgrounds,
    {
      data: campgroundData,
      loading: loadingCampgrounds,
      error: errorCampgrounds,
    },
  ] = useSearchCampgroundsLazyQuery();

  const [
    searchTrailheads,
    { data: trailheadData, loading: loadingTrailheads, error: errorTrailheads },
  ] = useSearchTrailheadsLazyQuery();

  useEffect(() => {
    if (campgroundData && campgrounds !== campgroundsRef.current) {
      campgroundsRef.current = campgrounds;
      updateMapMarkers(campgrounds);
    }
  }, [campgroundData]);

  useEffect(() => {
    if (trailheadData && trailheads !== trailheadsRef.current) {
      trailheadsRef.current = trailheads;
      updateMapMarkers(trailheads);
    }
  }, [trailheadData]);

  const campgroundsRef = useRef([]);
  const trailheadsRef = useRef([]);

  const debounceTime = 1000;
  const debouncedCampgroundSearch = useRef(
    debounce(searchCampgrounds, debounceTime)
  );
  const debouncedTrailheadSearch = useRef(
    debounce(searchTrailheads, debounceTime)
  );

  const campgrounds: Reservable[] =
    (tripType === 'Camp' &&
      campgroundData?.searchCampgrounds?.campgrounds?.filter(
        (cg) => !selectedPlacesObj[cg.id]
      )) ||
    [];

  const trailheads: Reservable[] =
    (tripType === 'Hike' &&
      trailheadData?.searchTrailheads?.trailheads?.filter(
        (th) => !selectedPlacesObj[th.id]
      )) ||
    [];

  const checkMarker = (id) => {
    let marker;
    if (tripType === 'Camp') {
      marker = campgroundData?.searchCampgrounds?.campgrounds?.find(
        (cg) => cg.id === id
      );
    } else {
      marker = trailheadData?.searchTrailheads?.trailheads?.find(
        (th) => th.id === id
      );
    }
    return marker;
  };

  const value = {
    campgroundData,
    campgrounds,
    campgroundSearch: debouncedCampgroundSearch,
    errorCampgrounds,
    errorTrailheads,
    trailheadSearch: debouncedTrailheadSearch,
    checkMarker,
    trailheads,
    trailheadData,
    loadingCampgrounds,
    loadingTrailheads,
  };
  return <SearchLocationsContext.Provider value={value} {...props} />;
}
export { SearchLocationsProvider, useSearchLocations };
