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
        <Spinner size='lg' />
        <Text>Loading</Text>
      </Box>
    </Flex>
  );
};
