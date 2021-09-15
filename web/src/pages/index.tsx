import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';
import Main from '../views/Main';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { LandingPage } from '../components/LandingPage';
import { SelectedPlaceProvider } from '../contexts/SelectedPlacesContext';
import { MapProvider } from '../contexts/MapContext';

const Index = () => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  return (
    <Layout>
      {loading || !data?.me ? (
        <LandingPage />
      ) : (
        <MapProvider>
          <SelectedPlaceProvider>
            <Main />
          </SelectedPlaceProvider>
        </MapProvider>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
