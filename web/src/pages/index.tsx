import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';
import Main from '../views/Main';
import { useMeQuery } from '../generated/graphql';
import { LandingPage } from '../components/LandingPage';

import { MainContextWrapper } from '../views/Main/MainContextWrapper';
import { CheckingTripRequestsProvider } from '../contexts/CheckingTripRequests';
import { LoadingContainer } from '../components/LoadingContainer';
import { ErrorContainer } from '../components/ErrorContainer';
import { ErrorFallback } from '../components/ErrorFallback';

const Index = () => {
  const { data, error, loading } = useMeQuery();

  const renderBody = () => {
    if (error) return <ErrorContainer />;
    if (loading) return <LoadingContainer />;
    if (!data?.me) return <LandingPage />;
    else
      return (
        <MainContextWrapper>
          <ErrorFallback showFullError>
            <Main />
          </ErrorFallback>
        </MainContextWrapper>
      );
  };

  return (
    <CheckingTripRequestsProvider>
      <Layout>{renderBody()}</Layout>
    </CheckingTripRequestsProvider>
  );
};

export default withApollo({ ssr: true })(Index);
