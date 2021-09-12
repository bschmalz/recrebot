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
import React from 'react';

import { FaWalking, FaCampground } from 'react-icons/fa';
import { SelectedPlaceInterface } from '.';
import { MultiDaypicker } from '../../components/MultiDaypicker';
import { Places, PlacesInterface } from './Places';
import { SelectedCard } from './SelectedCard';
import { Summary } from './Summary';

interface PlanTripProps extends PlacesInterface {
  removeSelectedPlace: Function;
  selectedCard: SelectedPlaceInterface;
  selectedDates: Date[];
  selectedPlaces: SelectedPlaceInterface[];
  setDates: Function;
  toggleTripType: Function;
}

export const PlanTrip: React.FC<PlanTripProps> = ({
  removeSelectedPlace,
  selectedCard,
  selectedDates,
  selectedPlaces,
  setDates,
  toggleTripType,
  tripType,
  ...placesProps
}) => {
  return (
    <Box>
      <Flex justifyContent="center">
        <Tabs align="center" width="100%">
          <Center>
            <TabList>
              <Tab fontSize="small">Destination(s)</Tab>
              <Tab fontSize="small">Trip Date(s)</Tab>
              <Tab
                fontSize="small"
                isDisabled={!selectedPlaces.length || !selectedDates.length}
              >
                Summary
              </Tab>
            </TabList>
          </Center>

          <TabPanels>
            <TabPanel paddingX={0}>
              <Flex justifyContent="center" marginBottom={3}>
                <Button
                  borderTopRightRadius={0}
                  borderBottomRightRadius={0}
                  variant={tripType === 'Camp' ? 'solid' : 'outline'}
                  colorScheme="green"
                  onClick={() => {
                    toggleTripType('Camp');
                  }}
                >
                  <FaCampground />
                  <Text marginLeft={2} fontSize="sm">
                    Camping
                  </Text>
                </Button>
                <Button
                  borderTopLeftRadius={0}
                  borderBottomLeftRadius={0}
                  variant={tripType === 'Hike' ? 'solid' : 'outline'}
                  colorScheme="green"
                  onClick={() => {
                    toggleTripType('Hike');
                  }}
                >
                  <FaWalking />
                  <Text marginLeft={2} fontSize="sm">
                    Hiking
                  </Text>
                </Button>
              </Flex>
              {selectedPlaces.length > 0 && (
                <Text fontSize={13} fontWeight="bold" marginBottom={1}>
                  Selected {tripType === 'Hike' ? 'Trailheads' : 'Campsites'}
                </Text>
              )}
              <Flex flexWrap="wrap" marginBottom={2}>
                {selectedPlaces.map((sp) => (
                  <Tag
                    size="md"
                    key={sp.id}
                    variant="solid"
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
              {selectedCard ? (
                <SelectedCard {...selectedCard} />
              ) : (
                <Places tripType={tripType} {...placesProps} />
              )}
            </TabPanel>
            <TabPanel>
              <MultiDaypicker dates={selectedDates} setDates={setDates} />
            </TabPanel>
            <TabPanel>
              <Summary
                selectedDates={selectedDates}
                selectedPlaces={selectedPlaces}
                tripType={tripType}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};
