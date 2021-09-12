import { Layout } from '../components/Layout';
import { withApollo } from '../utils/withApollo';
import Main from '../views/Main';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { LandingPage } from '../components/LandingPage';

const Index = () => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  return <Layout>{loading || !data?.me ? <LandingPage /> : <Main />}</Layout>;
};

export default withApollo({ ssr: true })(Index);
