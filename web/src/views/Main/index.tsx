import React, { useEffect } from 'react';

import { withApollo } from '../../utils/withApollo';
import { Sidebar } from './Sidebar';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import { ErrorBoundary } from 'react-error-boundary';
import { MyTrips } from './MyTrips';
import { PlanTrip } from './PlanTrip';
import { useMap } from '../../contexts/MapContext';
import { useTripType } from '../../contexts/TripTypeContext';
import { useMain } from '../../contexts/MainContext';
import { useMainFinal } from '../../contexts/MainFinalContext';
import { useTripRequests } from '../../contexts/TripRequestsContext';
import { usePlanTrip } from '../../contexts/PlanTripContext';
import { Map } from './Map';
import { ErrorFallback } from '../../components/ErrorFallback';

const Main = () => {
  const { searchText, sideBarView, setSideBarView, sideBarRef } = useMain();
  const { setTabIndex } = usePlanTrip();

  const { editingTripRequest } = useTripRequests();
  const { filterOnMap } = useMap();

  const { tripType } = useTripType();

  const { handleSearch, resetSelections } = useMainFinal();

  useEffect(() => {
    if (filterOnMap && (editingTripRequest || tripType === 'PlanATrip')) {
      handleSearch(searchText, tripType);
    }
  }, [filterOnMap]);

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
      <ErrorFallback
        message='There was an error rendering the map.'
        showFullError
      >
        <Map />
      </ErrorFallback>
    </Flex>
  );
};

export default withApollo({ ssr: false })(Main);
