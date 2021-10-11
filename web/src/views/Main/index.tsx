import { useEffect } from 'react';

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
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import { MyTrips } from './MyTrips';
import { PlanTrip } from './PlanTrip';
import { useMap } from '../../contexts/MapContext';
import { useTripType } from '../../contexts/TripTypeContext';
import { useMain } from '../../contexts/MainContext';
import { useMainFinal } from '../../contexts/MainFinalContext';
import { useTripRequests } from '../../contexts/TripRequestsContext';
import { usePlanTrip } from '../../contexts/PlanTripContext';
import { isServer } from '../../utils/isServer';

const Main = ({ something }) => {
  const {
    searchText,
    searchTextRef,
    sideBarView,
    sideBarViewRef,
    setSideBarView,
    sideBarRef,
  } = useMain();
  const { setTabIndex } = usePlanTrip();

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

  const { handleSearch, resetSelections } = useMainFinal();

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
    map.current.on('resize', onMapUpdate);
    map.current.on('pitchend', () => {
      console.log('pitch', map.current.getPitch());
    });
  };

  const onMapUpdate = () => {
    if (filterOnMapRef.current && sideBarViewRef.current === 'PlanATrip') {
      handleSearch(searchTextRef.current, tripTypeRef.current);
    }
  };

  const setSidebar = (newView) => {
    if (newView !== sideBarView) {
      setSideBarView(newView);
      resetSelections();
      setTabIndex(0);
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
            <Breadcrumb mb={2} ml={2} fontSize={14} fontWeight='bold'>
              <BreadcrumbItem>
                <BreadcrumbLink
                  as={editingTripRequest ? 'button' : undefined}
                  fontWeight='bold'
                  onClick={() => {
                    if (editingTripRequest) resetSelections();
                  }}
                >
                  All Trips
                </BreadcrumbLink>
              </BreadcrumbItem>

              {editingTripRequest ? (
                <BreadcrumbItem>
                  <BreadcrumbLink
                    as='button'
                    isCurrentPage={true}
                    disabled={true}
                  >
                    Trip Edit
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : null}
            </Breadcrumb>
          )}
          {sideBarView === 'MyTrips' && !editingTripRequest ? (
            <>
              <MyTrips />
            </>
          ) : (
            <PlanTrip />
          )}
        </>
      </Sidebar>
      {!isServer() && shouldRenderMap && (
        <Box
          ref={mapRef}
          w='100%'
          h='100%'
          id='recrebot-map'
          position='relative'
        >
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
      )}
    </Flex>
  );
};

export default withApollo({ ssr: false })(Main);
