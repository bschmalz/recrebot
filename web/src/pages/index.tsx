import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';
import Main from '../views/Main';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { LandingPage } from '../components/LandingPage';
import { SelectedPlaceProvider } from '../contexts/SelectedPlacesContext';
import { MapProvider } from '../contexts/MapContext';
import { TripRequestsProvider } from '../contexts/TripRequestsContext';
import { TripTypeProvider } from '../contexts/TripTypeContext';
import { SearchLocationsProvider } from '../contexts/SearchLocationsContext';
import { MainProvider } from '../contexts/MainContext';
import { MainFinalProvider } from '../contexts/MainFinalContext';

const Index = () => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  return (
    <Layout>
      {loading || !data?.me ? (
        <LandingPage />
      ) : (
        <MainProvider>
          <TripTypeProvider>
            <SelectedPlaceProvider>
              <TripRequestsProvider>
                <MapProvider>
                  <SearchLocationsProvider>
                    <MainFinalProvider>
                      <Main />
                    </MainFinalProvider>
                  </SearchLocationsProvider>
                </MapProvider>
              </TripRequestsProvider>
            </SelectedPlaceProvider>
          </TripTypeProvider>
        </MainProvider>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
