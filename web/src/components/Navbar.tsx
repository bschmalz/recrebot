import { Box } from '@chakra-ui/layout';
import { Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) {
    return 'Good Morning';
  } else if (hr < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

const greeting = getGreeting();

export const Navbar = () => {
  const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{`${greeting}, ${data.me.username}`}</Box>
        <Button
          variant="link"
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
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
      position="sticky"
      top={0}
      zIndex={1}
      bg="rgba(210, 220, 240, 0.1)"
      p={1}
    >
      <Flex flex={1} m="auto" align="center" maxW={1600} px={8}>
        <NextLink href="/">
          <Link>
            <Heading>RecreBot</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
