import React from 'react';
import { MainProvider } from '../../contexts/MainContext';
import { MainFinalProvider } from '../../contexts/MainFinalContext';
import { MapProvider } from '../../contexts/MapContext';
import { PlanTripProvider } from '../../contexts/PlanTripContext';
import { SearchLocationsProvider } from '../../contexts/SearchLocationsContext';
import { SelectedPlaceProvider } from '../../contexts/SelectedPlacesContext';
import { TripRequestsProvider } from '../../contexts/TripRequestsContext';
import { TripTypeProvider } from '../../contexts/TripTypeContext';

export const MainContextWrapper = ({ children }) => {
  return (
    <MainProvider>
      <TripTypeProvider>
        <PlanTripProvider>
          <SelectedPlaceProvider>
            <TripRequestsProvider>
              <MapProvider>
                <SearchLocationsProvider>
                  <MainFinalProvider>{children}</MainFinalProvider>
                </SearchLocationsProvider>
              </MapProvider>
            </TripRequestsProvider>
          </SelectedPlaceProvider>
        </PlanTripProvider>
      </TripTypeProvider>
    </MainProvider>
  );
};
