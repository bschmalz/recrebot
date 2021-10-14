import React, { useEffect } from 'react';
import MapboxGL from 'mapbox-gl';
import { Box, Checkbox, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import { useMap } from '../../contexts/MapContext';
import { useTripType } from '../../contexts/TripTypeContext';
import { useMain } from '../../contexts/MainContext';
import { useMainFinal } from '../../contexts/MainFinalContext';
import { useTripRequests } from '../../contexts/TripRequestsContext';
import { isServer } from '../../utils/isServer';
import { usePlanTrip } from '../../contexts/PlanTripContext';

export const Map = () => {
  const { searchText, searchTextRef, sideBarView, sideBarViewRef } = useMain();
  const { tabIndex } = usePlanTrip();

  const { editingTripRequest } = useTripRequests();
  const {
    filterOnMap,
    filterOnMapRef,
    map,
    mapRef,
    repositionMap,
    toggleMapFilter,
    toggleReposition,
  } = useMap();

  const { tripType, tripTypeRef } = useTripType();

  const { handleSearch } = useMainFinal();

  const [shouldRenderMap] = useMediaQuery('(min-width: 700px)');

  useEffect(() => {
    if (!map.current && mapRef.current && shouldRenderMap) {
      MapboxGL.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      map.current = new MapboxGL.Map({
        container: mapRef.current,
        style: process.env.NEXT_PUBLIC_MAPBOX_STYLE,
        center: [-118.26, 36.6],
        zoom: 7,
      });

      map.current.on('load', () => {
        initMap();
      });
    } else if (map.current && !shouldRenderMap) {
      map.current = null;
    }
  }, [map, mapRef, shouldRenderMap]);

  useEffect(() => {
    if (filterOnMap && (editingTripRequest || tripType === 'PlanATrip')) {
      handleSearch(searchText, tripType);
    }
  }, [filterOnMap]);

  const initMap = () => {
    map.current.on('dragend', onMapUpdate);
    map.current.on('zoomend', onMapUpdate);
    map.current.on('boxzoomend', onMapUpdate);
    map.current.on('moveend', onMapUpdate);
    map.current.on('resize', onMapUpdate);
    map.current.on('pitchend', () => {
      if (map.current.getPitch() > 0 && filterOnMapRef.current) {
        toggleMapFilter(true);
      }
    });
  };

  const onMapUpdate = () => {
    if (filterOnMapRef.current && sideBarViewRef.current === 'PlanATrip') {
      handleSearch(searchTextRef.current, tripTypeRef.current);
    }
  };

  return (
    !isServer() &&
    shouldRenderMap && (
      <Box ref={mapRef} w='100%' h='100%' id='recrebot-map' position='relative'>
        {!(
          (sideBarView === 'PlanATrip' || editingTripRequest) &&
          tabIndex === 1
        ) && (
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
            {sideBarView === 'PlanATrip' && tabIndex === 0 && (
              <Checkbox
                isChecked={filterOnMap}
                borderColor='#3182CE'
                onChange={() => toggleMapFilter()}
              >
                <Text fontSize={14}>Filter Results From Map Boundaries</Text>
              </Checkbox>
            )}
            <Checkbox
              isChecked={repositionMap}
              borderColor='#3182CE'
              onChange={toggleReposition}
            >
              <Text fontSize={14}> Reposition Map On Search Results</Text>
            </Checkbox>
          </Stack>
        )}
      </Box>
    )
  );
};
