import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { BACKGROUND_COLOR } from '../../constants';

interface SidebarProps {
  children: JSX.Element;
  setSidebar: Function;
  sideBarView: String;
}

export const Sidebar = React.forwardRef(
  (
    { children, setSidebar, sideBarView }: SidebarProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <Box
      w={600}
      h={'100%'}
      bg={BACKGROUND_COLOR}
      p={4}
      overflowY='auto'
      ref={ref}
    >
      <Flex justify='center' align='center' marginBottom={3}>
        <Button
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
          variant={sideBarView === 'MyTrips' ? 'solid' : 'outline'}
          colorScheme='green'
          onClick={() => setSidebar('MyTrips')}
        >
          My Trips
        </Button>
        <Button
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          variant={sideBarView === 'PlanATrip' ? 'solid' : 'outline'}
          colorScheme='green'
          onClick={() => setSidebar('PlanATrip')}
          data-cy='plan-trip'
        >
          Plan A Trip
        </Button>
      </Flex>
      {children}
    </Box>
  )
);
