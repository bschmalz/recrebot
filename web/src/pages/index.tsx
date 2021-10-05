import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';
import Head from 'next/head';
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
    if (error)
      return (
        <Layout>
          <ErrorContainer />
        </Layout>
      );
    if (loading)
      return (
        <Layout>
          <LoadingContainer />;
        </Layout>
      );
    if (!data?.me)
      return (
        <Layout variant='large'>
          <LandingPage />
        </Layout>
      );
    else
      return (
        <Layout>
          <MainContextWrapper>
            <ErrorFallback showFullError>
              <Main />
            </ErrorFallback>
          </MainContextWrapper>
        </Layout>
      );
  };

  return (
    <>
      <Head>
        <title>Recrebot</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='shortcut icon' href='/icons/favicon.ico' />
        <link rel='manifest' href='/manifest.json' />
        <link
          href='/favicon-16x16.png'
          rel='icon'
          type='image/png'
          sizes='16x16'
        />
        <link
          href='/favicon-32x32.png'
          rel='icon'
          type='image/png'
          sizes='32x32'
        />
        <link rel='apple-touch-icon' href='/apple-icon.png'></link>
      </Head>
      <CheckingTripRequestsProvider>
        {renderBody()}
      </CheckingTripRequestsProvider>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
