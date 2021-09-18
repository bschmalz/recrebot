import { useEffect, useRef } from 'react';
import { withApollo } from '../../utils/withApollo';
import { Sidebar } from './Sidebar';
import MapboxGL from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Checkbox,
  Flex,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  TripRequest,
  useSearchCampgroundsLazyQuery,
  useSearchTrailheadsLazyQuery,
} from '../../generated/graphql';
import { debounce } from '../../utils/debounce';
import { useSafeSetState } from '../../hooks/safeSetState';
import React from 'react';
import { MyTrips } from './MyTrips';
import { PlanTrip } from './PlanTrip';
import { useSelectedPlaces } from '../../contexts/SelectedPlacesContext';
import { useMap } from '../../contexts/MapContext';
import { useTripRequests } from '../../contexts/TripRequestsContext';
import { Campground } from './types/Campground';
import { Trailhead } from './types/Trailhead';

export interface SelectedPlaceInterface {
  type: string;
  name: string;
  parent_name: string;
  longitude: number;
  latitude: number;
  id: number;
  district?: string;
  description: string;
  source: string;
  legacy_id: string;
}

interface State {
  customName: string;
  editingTripRequest: TripRequest | null;
  searchText: string;
  selectedDates: Date[];
  sideBarView: 'MyTrips' | 'PlanATrip';
  tripType: 'Camp' | 'Hike';
}

const initialState: State = {
  customName: '',
  editingTripRequest: null,
  searchText: '',
  selectedDates: [],
  sideBarView: 'MyTrips',
  tripType: 'Camp',
};

const Main = () => {
  const [
    {
      customName,
      editingTripRequest,
      searchText,
      selectedDates,
      sideBarView,
      tripType,
    },
    safeSetState,
  ] = useSafeSetState(initialState);

  const [
    searchCampgrounds,
    { data: campgroundData, loading: loadingCampgrounds },
  ] = useSearchCampgroundsLazyQuery();

  const [
    searchTrailheads,
    { data: trailheadData, loading: loadingTrailheads },
  ] = useSearchTrailheadsLazyQuery();

  const campgroundsRef = useRef([]);
  const searchTextRef = useRef('');
  const sideBarRef = useRef(null);
  const scrollRef = useRef(0);
  const trailheadsRef = useRef([]);
  const tripTypeRef = useRef('Camp');

  const debounceTime = 800;
  const debouncedCampgroundSearch = useRef(
    debounce(searchCampgrounds, debounceTime)
  );
  const debouncedTrailheadSearch = useRef(
    debounce(searchTrailheads, debounceTime)
  );

  const {
    addMarker,
    filterOnMap,
    map,
    filterOnMapRef,
    mapRef,
    repositionMap,
    removeMarker,
    toggleMapFilter,
    toggleReposition,
    updateMapMarkers,
    zoomOnSelectedCard,
  } = useMap();

  const {
    addSelectedPlace,
    removeSelectedPlace,
    resetSelectedPlaces,
    selectCard,
    selectedCard,
    selectedPlaces,
    selectedPlacesObj,
    setSelectedPlaces,
  } = useSelectedPlaces();

  const {
    createTrip,
    deleteTripRequest,
    editTripRequest,
    errorTripRequests,
    loadingTripRequests,
    tripRequestsData,
  } = useTripRequests();

  const toast = useToast();

  const campgrounds: Campground[] =
    (tripType === 'Camp' &&
      campgroundData?.searchCampgrounds?.campgrounds?.filter(
        (cg) => !selectedPlacesObj[cg.id]
      )) ||
    [];

  const trailheads: Trailhead[] =
    (tripType === 'Hike' &&
      trailheadData?.searchTrailheads?.trailheads?.filter(
        (th) => !selectedPlacesObj[th.id]
      )) ||
    [];

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

  useEffect(() => {
    if (!map?.current) {
      MapboxGL.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      map.current = new MapboxGL.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [-118.26, 36.6],
        zoom: 7,
      });

      map.current.on('load', () => {
        initMap();
      });
    }
  }, [map, mapRef]);

  useEffect(() => {
    if (filterOnMap && (editingTripRequest || tripType === 'PlanATrip')) {
      handleSearch(searchText, tripType);
    }
  }, [filterOnMap]);

  const addSelectedCard = () => {
    addSelectedPlace(selectedCard);
    removeMarker(selectedCard.id);
    const markers =
      tripType === 'Camp'
        ? campgrounds.filter((cg) => cg.id !== selectedCard.id)
        : trailheads.filter((th) => th.id !== selectedCard.id);
    requestAnimationFrame(() => {
      updateMapMarkers(markers);
      sideBarRef.current.scrollTop = scrollRef.current;
    });
  };

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

  const createTripRequestObj = (customName: string, minNights) => {
    const tr = {
      type: tripType,
      dates: selectedDates,
      locations: selectedPlaces.map((sp) => sp.id),
      custom_name: customName,
    };
    if (minNights) tr['min_nights'] = parseInt(minNights);
    return tr;
  };

  const handleCardClick = (id) => {
    if (!id) {
      selectCard(null);
      requestAnimationFrame(() => {
        sideBarRef.current.scrollTop = scrollRef.current;
        const markers = tripType === 'Camp' ? campgrounds : trailheads;
        updateMapMarkers(markers);
      });
      return;
    }
    let item, type;
    if (tripType === 'Camp') {
      item = campgrounds.find((cg) => cg.id === id);
      type = 'campground';
    } else {
      item = trailheads.find((th) => th.id === id);
      type = 'trailhead';
    }
    scrollRef.current = sideBarRef.current.scrollTop;
    sideBarRef.current.scrollTop = 170;
    selectCard({ ...item, type });
    zoomOnSelectedCard(item);
  };

  const handleSearch = (val, type) => {
    const center = JSON.stringify(map.current.getCenter());
    const bounds = JSON.stringify(map.current.getBounds());

    const callback =
      type === 'Camp'
        ? debouncedCampgroundSearch.current
        : debouncedTrailheadSearch.current;
    callback({
      variables: {
        searchTerm: val,
        mapCenter: center,
        mapBounds: bounds,
        filterOnBounds: filterOnMapRef.current,
      },
    });
  };

  const handlePlanTripTabChange = (showSelected) => {
    if (showSelected) {
      updateMapMarkers(selectedPlaces);
    } else {
      const markers = tripType === 'Camp' ? campgrounds : trailheads;
      updateMapMarkers(markers);
    }
  };

  const initMap = () => {
    map.current.on('dragend', onMapUpdate);
    map.current.on('zoomend', onMapUpdate);
  };

  const onMapUpdate = () => {
    if (filterOnMapRef.current) {
      handleSearch(searchTextRef.current, tripTypeRef.current);
    }
  };

  const onSearchTextChange = (searchText) => {
    safeSetState({ searchText });
    handleSearch(searchText, tripType);
    searchTextRef.current = searchText;
  };

  const removePlace = (id) => {
    removeSelectedPlace(id);
    const marker = checkMarker(id);
    if (marker) {
      addMarker(marker);
    }
  };

  const resetSelections = () => {
    safeSetState({
      customName: '',
      editingTripRequest: null,
      searchText: '',
      selectedDates: [],
    });
    resetSelectedPlaces();
  };

  const saveTripRequest = async (customName: string, minNights: number) => {
    const tr = createTripRequestObj(customName, minNights);
    updateMapMarkers([]);
    try {
      if (sideBarView === 'MyTrips') {
        await editTripRequest({ ...tr, id: editingTripRequest.id });
      } else {
        await createTrip(tr);
      }
      toast({
        title: 'Trip request saved.',
        description: "We'll let you know if it gets any hits!",
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      if (editingTripRequest) {
        safeSetState({ editingTripRequest: null });
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: 'We were unable to save the trip request.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const setEditingTripRequest = (tr) => {
    setSelectedPlaces(tr.locations);
    safeSetState({
      customName: tr.custom_name,
      editingTripRequest: tr,
      selectedDates: tr.dates.map((d) => new Date(d)),
      tripType: tr.type,
    });
    tripTypeRef.current = tr.type;
  };

  const setSidebar = (newView) => {
    if (newView !== sideBarView) {
      safeSetState({ sideBarView: newView });
      resetSelections();
    }
  };

  const toggleTripType = (newTripType) => {
    if (newTripType !== tripType) {
      safeSetState({
        tripType: newTripType,
      });

      setSelectedPlaces([]);

      tripTypeRef.current = newTripType;

      const places =
        newTripType === 'Camp'
          ? campgroundData?.searchCampgrounds?.campgrounds || []
          : trailheadData?.searchTrailheads?.trailheads || [];

      updateMapMarkers(places);
      handleSearch(searchText, newTripType);
    }
  };

  return (
    <Flex width='100%'>
      <Sidebar
        setSidebar={setSidebar}
        sideBarView={sideBarView}
        ref={sideBarRef}
      >
        <>
          {sideBarView === 'MyTrips' && (
            <Breadcrumb
              mb={2}
              ml={2}
              fontSize={14}
              fontWeight='bold'
              onClick={() => {
                if (editingTripRequest) resetSelections();
              }}
            >
              <BreadcrumbItem>
                <BreadcrumbLink>All Trips</BreadcrumbLink>
              </BreadcrumbItem>

              {editingTripRequest ? (
                <BreadcrumbItem>
                  <BreadcrumbLink>Trip Edit</BreadcrumbLink>
                </BreadcrumbItem>
              ) : null}
            </Breadcrumb>
          )}
          {sideBarView === 'MyTrips' && !editingTripRequest ? (
            <>
              <MyTrips
                deleteTripRequest={deleteTripRequest}
                tripRequests={tripRequestsData?.getTripRequests?.tripRequests}
                loading={loadingTripRequests}
                error={errorTripRequests}
                setEditingTripRequest={setEditingTripRequest}
              />
            </>
          ) : (
            <PlanTrip
              addSelectedCard={addSelectedCard}
              campgrounds={campgrounds}
              customName={customName}
              editingTripRequest={editingTripRequest}
              handleCardClick={handleCardClick}
              loadingCampgrounds={loadingCampgrounds}
              loadingTrailheads={loadingTrailheads}
              onTabChange={handlePlanTripTabChange}
              removeSelectedPlace={removePlace}
              saveTripRequest={saveTripRequest}
              searchText={searchText}
              selectedCard={selectedCard}
              selectedDates={selectedDates}
              selectedPlaces={selectedPlaces}
              setDates={(selectedDates) => {
                safeSetState({ selectedDates });
              }}
              setName={(customName) => {
                safeSetState({ customName });
              }}
              onSearchTextChange={onSearchTextChange}
              toggleTripType={toggleTripType}
              trailheads={trailheads}
              tripType={tripType}
            />
          )}
        </>
      </Sidebar>
      <Box ref={mapRef} w='100%' h='100%' id='recrebot-map' position='relative'>
        <Stack
          spacing={3}
          direction='column'
          position='absolute'
          top={5}
          right={5}
          zIndex={10}
          fontWeight='bold'
          backgroundColor='rgba(240, 240, 240, .65)'
          p={2}
          borderRadius={6}
        >
          <Checkbox
            isChecked={filterOnMap}
            borderColor='#3182CE'
            onChange={toggleMapFilter}
          >
            <Text fontSize={14}>Filter Results From Map Boundaries</Text>
          </Checkbox>
          <Checkbox
            isChecked={repositionMap}
            borderColor='#3182CE'
            onChange={toggleReposition}
          >
            <Text fontSize={14}> Reposition Map On Search Results</Text>
          </Checkbox>
        </Stack>
      </Box>
    </Flex>
  );
};

export default withApollo({ ssr: true })(Main);
