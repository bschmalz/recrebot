import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Wrapper } from '../../components/Wrapper';
import { useVerifyEmailMutation } from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';
import { Box } from '@chakra-ui/react';
import { useState } from 'react';

const VerifyEmail: NextPage = ({}) => {
  const [error, setError] = useState(false);
  const router = useRouter();
  const [verifyEmail] = useVerifyEmailMutation();
  const token = router?.query?.token as string;

  const validateEmail = async () => {
    let res;
    try {
      res = await verifyEmail({ variables: { token } });
    } catch (e) {}
    const { data } = res;
    if (data?.verifyEmail?.errors) {
      setError(true);
    } else if (data?.verifyEmail?.user?.id) {
      router.push('/');
    }
  };

  useEffect(() => {
    if (token) validateEmail();
  }, [token]);

  if (typeof token !== 'string')
    return (
      <Wrapper>
        <Box>Invalid Token</Box>
      </Wrapper>
    );

  if (error) {
    return (
      <Wrapper>
        <Box>Error registering your account.</Box>
      </Wrapper>
    );
  }

  return <Wrapper variant='small'></Wrapper>;
};

export default withApollo({ ssr: true })(VerifyEmail);
