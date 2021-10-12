import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useSafeSetState } from '../hooks/safeSetState';
import MapboxGL from 'mapbox-gl';

import { isValidCoord } from '../utils/isValidCoord';
import { useSelectedPlaces } from './SelectedPlacesContext';
import { usePlanTrip } from './PlanTripContext';
import { useMain } from './MainContext';

const MARKER_COLOR = '#F7C502';

const MARKER_HIGHLIGHT_COLOR = '#0A6318';

interface MapState {
  addMarker?: (id: number) => void;
  filterOnMap: boolean;
  map?: { current: any };
  filterOnMapRef?: any;
  focusOnMarkers?: () => void;
  highlightMouseMarker?: (id: number) => void;
  mapRef?: any;
  markersRef?: any;
  repositionMap: boolean;
  removeMarker?: (id: number) => void;
  toggleMapFilter?: (toggle?: boolean) => void;
  toggleReposition?: () => void;
  unhighlightMouseMarker?: (id: number) => void;
  updateMapMarkers?: ([]) => void;
  zoomOnSelectedCard?: (id: number) => void;
}

const initialState: MapState = {
  filterOnMap: false,
  repositionMap: true,
};

const MapContext = createContext(initialState);

function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error(`useMap must be used within a CountProvider`);
  }
  return context;
}

function MapProvider(props) {
  const [{ filterOnMap, repositionMap }, safeSetState] =
    useSafeSetState(initialState);

  const filterOnMapRef = useRef(false);
  const map = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  const { selectCard } = useSelectedPlaces();
  const { sideBarViewRef } = useMain();
  const { setTabIndex, tabRef } = usePlanTrip();

  const addMarker = (m) => {
    if (!isValidCoord(m.latitude, m.longitude)) return;

    const nm = new MapboxGL.Marker({ color: MARKER_COLOR })
      .setLngLat([m.longitude, m.latitude])
      .addTo(map.current);

    const type = m.__typename === 'Trailhead' ? 'trailhead' : 'campground';

    const el = nm.getElement();
    el.onclick = (e) => {
      selectCard({ ...m, type });
      // If we are in plan a trip mode, and on the date screen, move back to the places screen if they select on a place on the map.
      // UX!!!
      if (tabRef.current === 1) {
        setTabIndex(0);
      }
    };

    markersRef.current[m.id] = { ...m, marker: nm };
  };

  const focusOnMarkers = () => {
    const boundingBox = new MapboxGL.LngLatBounds();
    for (let key in markersRef?.current) {
      const marker = markersRef.current[key].marker;
      boundingBox.extend(marker.getLngLat());
    }
    map.current?.fitBounds(boundingBox, {
      maxZoom: 12,
      padding: {
        top: 150,
        bottom: 150,
        left: 150,
        right: 150,
      },
    });
  };

  const highlightMouseMarker = (id) => {
    const marker = markersRef?.current[id]?.marker;
    if (!marker) return;
    let markerElement = marker.getElement();
    markerElement
      .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
      .setAttribute('fill', MARKER_HIGHLIGHT_COLOR);

    marker._color = MARKER_HIGHLIGHT_COLOR;

    marker.remove();
    marker.addTo(map.current);
  };

  const removeMarker = (id) => {
    if (markersRef.current[id]?.marker) {
      markersRef.current[id].marker.remove();
      delete markersRef.current[id];
    }
  };

  const removeMarkers = () => {
    for (let key in markersRef.current) {
      markersRef?.current[key]?.marker.remove();
      delete markersRef?.current[key];
    }
  };

  const toggleMapFilter = (defaultSetting) => {
    let toggle;
    if (defaultSetting !== undefined) {
      toggle = defaultSetting;
    } else {
      toggle = filterOnMap;
    }
    if (toggle) {
      filterOnMapRef.current = false;
      safeSetState({ filterOnMap: false });
      map.current.setMinZoom(null);
    } else {
      filterOnMapRef.current = true;
      map.current.setPitch(0);
      map.current.setMinZoom(9);
      map.current.resize();
      safeSetState({ filterOnMap: true, repositionMap: false });
    }
  };

  const toggleReposition = () => {
    if (repositionMap) safeSetState({ repositionMap: false });
    else {
      safeSetState({ repositionMap: true, filterOnMap: false });
      filterOnMapRef.current = false;
    }
  };

  const unhighlightMouseMarker = (id) => {
    const marker = markersRef.current[id]?.marker;
    if (!marker) return;
    let markerElement = marker.getElement();
    markerElement
      .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
      .setAttribute('fill', MARKER_COLOR);
    marker._color = MARKER_COLOR;
  };

  const updateMapMarkers = (newMarkers) => {
    removeMarkers();
    if (!newMarkers?.length) return;
    try {
      newMarkers.forEach(addMarker);
      if (repositionMap) focusOnMarkers();
    } catch (e) {}
  };

  const zoomOnSelectedCard = (item) => {
    updateMapMarkers([item]);
  };

  const value = {
    addMarker,
    filterOnMap,
    map,
    filterOnMapRef,
    focusOnMarkers,
    highlightMouseMarker,
    mapRef,
    markersRef,
    repositionMap,
    removeMarker,
    toggleMapFilter,
    toggleReposition,
    unhighlightMouseMarker,
    updateMapMarkers,
    zoomOnSelectedCard,
  };
  return <MapContext.Provider value={value} {...props} />;
}
export { MapProvider, useMap };
