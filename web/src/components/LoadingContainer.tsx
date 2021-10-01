import { Box, Flex, Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import React from 'react';

export const LoadingContainer = () => {
  return (
    <Flex w='100%' h='100%' position='relative'>
      <Box
        position='absolute'
        w='100%'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        textAlign='center'
      >
        <Spinner
          size='lg'
          thickness='2px'
          speed='0.65s'
          emptyColor='gray.200'
          color='green.700'
        />
        <Text>Loading</Text>
      </Box>
    </Flex>
  );
};
