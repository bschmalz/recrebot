import { Box } from '@chakra-ui/layout';
import { Button, Flex, Heading, Link, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { SpinningGear } from './SpinningGear';
import { useCheckingTripRequests } from '../contexts/CheckingTripRequests';
import { useMe } from '../contexts/MeContext';
import { ContactModal } from './ContactModal';

export const Navbar = ({}) => {
  const router = useRouter();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMe();
  const { checking } = useCheckingTripRequests();
  const { isOpen, onOpen, onClose } = useDisclosure();

  let body;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Button data-cy='login-link' variant='link'>
            login
          </Button>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        {false && data?.me?.email === process.env.NEXT_PUBLIC_EMAIL ? (
          <NextLink href='/invite'>
            <Link mr={3}>invite</Link>
          </NextLink>
        ) : (
          <Button mr={3} variant='link' onClick={onOpen}>
            contact
          </Button>
        )}
        <Button
          data-cy='logout-link'
          variant='link'
          onClick={async () => {
            await logout();
            await apolloClient.clearStore();
            await router.reload();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <>
      <Flex
        position='fixed'
        top={0}
        zIndex={3}
        p={1}
        height='47px'
        background='white'
        width='100%'
      >
        <Flex flex={1} m='auto' align='center' maxW={1600} px={8}>
          <Heading>
            <Flex alignItems='flex-end'>
              RecreB
              <Box mb='6px'>
                <SpinningGear spinning={checking || loading} />
              </Box>{' '}
              t
            </Flex>
          </Heading>

          <Box ml='auto'>{body}</Box>
        </Flex>
      </Flex>
      {isOpen && (
        <ContactModal isModalOpen={isOpen} handleModalClose={onClose} />
      )}
    </>
  );
};
