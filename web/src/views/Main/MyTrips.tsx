import { Flex } from '@chakra-ui/react';
import React from 'react';

interface MyTripsProps {}

export const MyTrips: React.FC<MyTripsProps> = ({}) => {
  return (
    <Flex justifyContent="center">
      You currently have no trips. Maybe plan one?
    </Flex>
  );
};
