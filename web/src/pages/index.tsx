import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';
import Main from '../views/Main';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { LandingPage } from '../components/LandingPage';

import { MainContextWrapper } from '../views/Main/MainContextWrapper';
import { CheckingTripRequestsProvider } from '../contexts/CheckingTripRequests';

const Index = () => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  return (
    <CheckingTripRequestsProvider>
      <Layout>
        {loading || !data?.me ? (
          <LandingPage />
        ) : (
          <MainContextWrapper>
            <Main />
          </MainContextWrapper>
        )}
      </Layout>
    </CheckingTripRequestsProvider>
  );
};

export default withApollo({ ssr: true })(Index);
