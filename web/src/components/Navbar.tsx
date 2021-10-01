import { Box } from '@chakra-ui/layout';
import { Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { SpinningGear } from './SpinningGear';
import { useCheckingTripRequests } from '../contexts/CheckingTripRequests';

export const Navbar = () => {
  const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const { checking } = useCheckingTripRequests();

  let body;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2} data-cy='login-link'>
            login
          </Link>
        </NextLink>
        {/* <NextLink href='/register'>
          <Link>register</Link>
        </NextLink> */}
      </>
    );
  } else {
    body = (
      <Flex>
        {data?.me?.email === process.env.NEXT_PUBLIC_EMAIL ? (
          <NextLink href='/invite'>
            <Link mr={3}>invite</Link>
          </NextLink>
        ) : null}
        <Button
          data-cy='logout-link'
          variant='link'
          onClick={async () => {
            await logout();
            await apolloClient.clearStore();
            router.reload();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      position='sticky'
      top={0}
      zIndex={1}
      bg='rgba(210, 220, 240, 0.1)'
      p={1}
    >
      <Flex flex={1} m='auto' align='center' maxW={1600} px={8}>
        <NextLink href='/'>
          <Link>
            <Heading>
              <Flex alignItems='flex-end'>
                RecreB
                <Box mb='6px'>
                  <SpinningGear spinning={checking} />
                </Box>{' '}
                t
              </Flex>
            </Heading>
          </Link>
        </NextLink>
        <Box ml='auto'>{body}</Box>
      </Flex>
    </Flex>
  );
};
