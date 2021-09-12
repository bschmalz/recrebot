import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { BACKGROUND_COLOR } from '../../constants';

interface SidebarProps {
  setMainState: Function;
  sideBarView: String;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  setMainState,
  sideBarView,
}) => {
  return (
    <Box w={600} h={'100%'} bg={BACKGROUND_COLOR} p={4} overflowY="auto">
      <Flex justify="center" align="center" marginBottom={3}>
        <Button
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
          variant={sideBarView === 'MyTrips' ? 'solid' : 'outline'}
          colorScheme="green"
          onClick={() => setMainState({ sideBarView: 'MyTrips' })}
        >
          My Trips
        </Button>
        <Button
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          variant={sideBarView === 'PlanATrip' ? 'solid' : 'outline'}
          colorScheme="green"
          onClick={() => setMainState({ sideBarView: 'PlanATrip' })}
        >
          Plan A Trip
        </Button>
      </Flex>
      {children}
    </Box>
  );
};
