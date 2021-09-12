import { useEffect, useRef } from 'react';
import { withApollo } from '../../utils/withApollo';
import { Sidebar } from './Sidebar';
import MapboxGL from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Checkbox, Flex, Stack } from '@chakra-ui/react';
import {
  Campground,
  Trailhead,
  useSearchCampgroundsLazyQuery,
  useSearchTrailheadsLazyQuery,
} from '../../generated/graphql';
import { debounce } from '../../utils/debounce';
import { useSafeSetState } from '../../hooks/safeSetState';
import ReactDOM from 'react-dom';
import React from 'react';
import { MyTrips } from './MyTrips';
import { PlanTrip } from './PlanTrip';

export interface SelectedPlaceInterface {
  type: string;
  name: string;
  recarea_name: string;
  longitude: string;
  latitude: string;
  id: number;
  district?: string;
  description: string;
  source: string;
  legacy_id: number;
}

interface State {
  filterOnMap: boolean;
  repositionMap: boolean;
  searchText: string;
  selectedCard: SelectedPlaceInterface;
  selectedDates: Date[];
  selectedPlaces: SelectedPlaceInterface[];
  selectedPlacesObj: { [key: string]: SelectedPlaceInterface };
  sideBarView: 'MyTrips' | 'PlanATrip';
  tripType: 'Camp' | 'Hike';
}

const initialState: State = {
  filterOnMap: false,
  repositionMap: true,
  searchText: '',
  selectedCard: null,
  selectedDates: [],
  selectedPlaces: [],
  selectedPlacesObj: {},
  sideBarView: 'MyTrips',
  tripType: 'Camp',
};

const MARKER_COLOR = '#F7C502';
const MARKER_HIGHLIGHT_COLOR = '#38A169';

const Main = () => {
  const [
    {
      filterOnMap,
      repositionMap,
      searchText,
      selectedCard,
      selectedDates,
      selectedPlaces,
      selectedPlacesObj,
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

  // TODO - change state refs to be one object, not a giant list of refs we need to keep maintaining
  const campgroundsRef = useRef([]);
  const filterOnMapRef = useRef(false);
  const map = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const trailheadsRef = useRef([]);

  const debounceTime = 800;
  const debouncedCampgroundSearch = useRef(
    debounce(searchCampgrounds, debounceTime)
  );
  const debouncedTrailheadSearch = useRef(
    debounce(searchTrailheads, debounceTime)
  );

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

  const addPopup = (marker, { id }) => {
    const placeholder = document.createElement('div');
    const el = <Box onClick={() => console.log('yo', id)}>I'm a boxer</Box>;
    ReactDOM.render(el, placeholder);

    const popup = new MapboxGL.Popup().setDOMContent(placeholder);

    marker.setPopup(popup);
  };

  const addMarker = (m) => {
    if (!isValidCoord(m.latitude, m.longitude)) return;

    const nm = new MapboxGL.Marker({ color: MARKER_COLOR })
      .setLngLat([m.longitude, m.latitude])
      .addTo(map.current);

    addPopup(nm, m);

    markersRef.current[m.id] = { ...m, marker: nm };
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

  const addSelectedPlace = (sp) => {
    const newSelectedPlacesObj = { ...selectedPlacesObj };
    newSelectedPlacesObj[sp.id] = sp;
    safeSetState({
      selectedPlaces: [...selectedPlaces, sp],
      selectedPlacesObj: newSelectedPlacesObj,
    });
    removeMarker(sp.id);
  };

  const focusOnMarkers = () => {
    const boundingBox = new MapboxGL.LngLatBounds();
    for (let key in markersRef.current) {
      const marker = markersRef.current[key].marker;
      boundingBox.extend(marker.getLngLat());
    }
    map.current.fitBounds(boundingBox, {
      maxZoom: 12,
      padding: {
        top: 150,
        bottom: 150,
        left: 150,
        right: 150,
      },
    });
  };

  const handleCardClick = (id) => {
    let item, type;
    if (tripType === 'Camp') {
      item = campgrounds.find((cg) => cg.id === id);
      type = 'campground';
    } else {
      item = trailheads.find((th) => th.id === id);
      type = 'trailhead';
    }
    safeSetState({ selectedCard: { ...item, type } });
  };

  const handleCardMouseEnter = (id) => {
    const marker = markersRef.current[id]?.marker;
    if (!marker) return;
    let markerElement = marker.getElement();
    markerElement
      .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
      .setAttribute('fill', MARKER_HIGHLIGHT_COLOR);

    marker._color = MARKER_HIGHLIGHT_COLOR;

    marker.remove();
    marker.addTo(map.current);
  };

  const handleCardMouseLeave = (id) => {
    const marker = markersRef.current[id]?.marker;
    if (!marker) return;
    let markerElement = marker.getElement();
    markerElement
      .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
      .setAttribute('fill', MARKER_COLOR);
    marker._color = MARKER_COLOR;
  };

  const handleSearch = (val, type) => {
    const center = JSON.stringify(map.current.getCenter());
    const bounds = JSON.stringify(map.current.getBounds());

    //todo - this is a no-no
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

  const isValidCoord = (lat: number, lng: number) => {
    return lat > 19.5 && lat < 64.85 && lng > -161.755 && lng < -68.011;
  };

  const initMap = () => {
    map.current.on('dragend', onMapUpdate);
    map.current.on('zoomend', onMapUpdate);
  };

  const onMapUpdate = () => {
    if (filterOnMapRef.current) {
      handleSearch(searchText, tripType);
    }
  };

  const onSearchTextChange = (searchText) => {
    safeSetState({ searchText });
    handleSearch(searchText, tripType);
  };

  const removeMarker = (id) => {
    if (markersRef.current[id]?.marker) {
      markersRef.current[id].marker.remove();
      delete markersRef.current[id];
    }
  };

  const removeMarkers = () => {
    for (let key in markersRef.current) {
      markersRef.current[key].marker.remove();
      delete markersRef.current[key];
    }
  };

  const removeSelectedPlace = (id) => {
    const newSelectedPlaces = selectedPlaces.filter((sp) => sp.id !== id);
    const newSelectedPlacesObj = { ...selectedPlacesObj };
    delete newSelectedPlacesObj[id];
    safeSetState({
      selectedPlaces: newSelectedPlaces,
      selectedPlacesObj: newSelectedPlacesObj,
    });
    const marker = checkMarker(id);
    if (marker) {
      addMarker(marker);
    }
  };

  const toggleMapFilter = () => {
    if (filterOnMap) {
      safeSetState({ filterOnMap: false });
      filterOnMapRef.current = false;
    } else {
      safeSetState({ filterOnMap: true, repositionMap: false });
      filterOnMapRef.current = true;
    }
  };

  const toggleReposition = () => {
    if (repositionMap) safeSetState({ repositionMap: false });
    else {
      safeSetState({ repositionMap: true, filterOnMap: false });
      filterOnMapRef.current = false;
    }
  };

  const toggleTripType = (newTripType) => {
    if (newTripType !== tripType) {
      safeSetState({
        tripType: newTripType,
        selectedPlaces: [],
        selectedPlacesObj: {},
      });

      const places =
        newTripType === 'Camp'
          ? campgroundData?.searchCampgrounds?.campgrounds || []
          : trailheadData?.searchTrailheads?.trailheads || [];

      updateMapMarkers(places);
      handleSearch(searchText, newTripType);
    }
  };

  const updateMapMarkers = (newMarkers) => {
    removeMarkers();
    if (!newMarkers?.length) return;
    try {
      newMarkers.forEach(addMarker);
      if (repositionMap) focusOnMarkers();
    } catch (e) {}
  };

  return (
    <Flex width="100%">
      <Sidebar setMainState={safeSetState} sideBarView={sideBarView}>
        {sideBarView === 'MyTrips' ? (
          <MyTrips />
        ) : (
          <PlanTrip
            addSelectedPlace={addSelectedPlace}
            campgrounds={campgrounds}
            handleCardClick={handleCardClick}
            handleCardMouseEnter={handleCardMouseEnter}
            handleCardMouseLeave={handleCardMouseLeave}
            loadingCampgrounds={loadingCampgrounds}
            loadingTrailheads={loadingTrailheads}
            removeSelectedPlace={removeSelectedPlace}
            searchText={searchText}
            selectedCard={selectedCard}
            selectedDates={selectedDates}
            selectedPlaces={selectedPlaces}
            setDates={(selectedDates) => {
              safeSetState({ selectedDates });
            }}
            onSearchTextChange={onSearchTextChange}
            toggleTripType={toggleTripType}
            trailheads={trailheads}
            tripType={tripType}
          />
        )}
      </Sidebar>
      <Box ref={mapRef} w="100%" h="100%" id="recrebot-map" position="relative">
        <Stack
          spacing={3}
          direction="column"
          position="absolute"
          top={5}
          right={10}
          zIndex={10}
          fontWeight="bold"
          backgroundColor="rgba(240, 240, 240, .65)"
          p={2}
          borderRadius={6}
        >
          <Checkbox
            isChecked={filterOnMap}
            borderColor="#3182CE"
            onChange={toggleMapFilter}
          >
            Filter Results From Map Boundaries
          </Checkbox>
          <Checkbox
            isChecked={repositionMap}
            borderColor="#3182CE"
            onChange={toggleReposition}
          >
            Reposition Map On Search Results
          </Checkbox>
        </Stack>
      </Box>
    </Flex>
  );
};

export default withApollo({ ssr: true })(Main);
