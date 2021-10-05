import {
  Box,
  Button,
  Center,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { FaWalking, FaCampground } from 'react-icons/fa';
import { MultiDaypicker } from '../../components/MultiDaypicker';
import { Places } from '../../components/Places';
import { SelectedCard } from '../../components/SelectedCard';
import { Summary } from '../../components/Summary';
import { useTripType } from '../../contexts/TripTypeContext';
import { useSelectedPlaces } from '../../contexts/SelectedPlacesContext';
import { useTripRequests } from '../../contexts/TripRequestsContext';
import { useMainFinal } from '../../contexts/MainFinalContext';
import { usePlanTrip } from '../../contexts/PlanTripContext';

export const PlanTrip: React.FC = () => {
  const { tripType } = useTripType();
  const { handleTabChange, toggleTripType } = useMainFinal();

  const { removeSelectedPlace, selectedCard, selectedDates, selectedPlaces } =
    useSelectedPlaces();
  const { editingTripRequest } = useTripRequests();

  const { setTabIndex, tabIndex } = usePlanTrip();

  return (
    <Box>
      <Flex justifyContent='center'>
        <Tabs
          align='center'
          width='100%'
          index={tabIndex}
          onChange={setTabIndex}
        >
          <Center>
            <TabList>
              <Tab fontSize='small' onClick={() => handleTabChange(1)}>
                Destination(s)
              </Tab>
              <Tab fontSize='small' onClick={() => handleTabChange(2)}>
                Trip Date(s)
              </Tab>
              <Tab
                onClick={() => handleTabChange(3)}
                fontSize='small'
                isDisabled={!selectedPlaces.length || !selectedDates.length}
              >
                Summary
              </Tab>
            </TabList>
          </Center>

          <TabPanels>
            <TabPanel paddingX={0}>
              {!editingTripRequest && (
                <Flex justifyContent='center' marginBottom={3}>
                  <Button
                    borderTopRightRadius={0}
                    borderBottomRightRadius={0}
                    variant={tripType === 'Camp' ? 'solid' : 'outline'}
                    colorScheme='green'
                    onClick={() => {
                      toggleTripType('Camp');
                    }}
                  >
                    <FaCampground />
                    <Text marginLeft={2} fontSize='sm'>
                      Camping
                    </Text>
                  </Button>
                  <Button
                    borderTopLeftRadius={0}
                    borderBottomLeftRadius={0}
                    variant={tripType === 'Hike' ? 'solid' : 'outline'}
                    colorScheme='green'
                    onClick={() => {
                      toggleTripType('Hike');
                    }}
                  >
                    <FaWalking />
                    <Text marginLeft={2} fontSize='sm'>
                      Hiking
                    </Text>
                  </Button>
                </Flex>
              )}
              {selectedPlaces.length > 0 && (
                <Text fontSize={13} fontWeight='bold' marginBottom={1}>
                  Selected {tripType === 'Hike' ? 'Trailheads' : 'Campsites'}
                </Text>
              )}
              <Flex flexWrap='wrap' marginBottom={2}>
                {selectedPlaces.map((sp) => (
                  <Tag
                    size='md'
                    key={sp.id}
                    variant='solid'
                    marginRight={2}
                    marginBottom={1}
                    fontSize={12}
                  >
                    <TagLabel>{sp.name}</TagLabel>
                    <TagCloseButton
                      onClick={(e) => removeSelectedPlace(sp.id)}
                    />
                  </Tag>
                ))}
              </Flex>
              {selectedCard ? <SelectedCard /> : <Places />}
            </TabPanel>
            <TabPanel paddingX={2}>
              <MultiDaypicker />
            </TabPanel>
            <TabPanel paddingX={2}>
              <Summary
                minimumNights={editingTripRequest?.min_nights}
                numHikers={editingTripRequest?.num_hikers}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};
