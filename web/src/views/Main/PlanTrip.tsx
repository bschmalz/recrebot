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
import { SelectedPlaceInterface } from '.';
import { MultiDaypicker } from '../../components/MultiDaypicker';
import { TripRequest } from '../../generated/graphql';
import { Places, PlacesInterface } from './Places';
import { SelectedCard } from './SelectedCard';
import { Summary, SummaryInterface } from './Summary';

interface PlanTripProps extends PlacesInterface, SummaryInterface {
  addSelectedCard: Function;
  editingTripRequest: TripRequest | null;
  onTabChange: Function;
  removeSelectedPlace: Function;
  saveTripRequest: Function;
  selectedCard: SelectedPlaceInterface;
  selectedDates: Date[];
  selectedPlaces: SelectedPlaceInterface[];
  setDates: Function;
  toggleTripType: Function;
}

export const PlanTrip: React.FC<PlanTripProps> = ({
  addSelectedCard,
  customName,
  editingTripRequest,
  handleCardClick,
  onTabChange,
  removeSelectedPlace,
  saveTripRequest,
  selectedCard,
  selectedDates,
  selectedPlaces,
  setDates,
  setName,
  toggleTripType,
  tripType,
  ...placesProps
}) => {
  const [summarySelected, setSummarySelected] = useState(false);
  const [hasSearched, toggleSearched] = useState(false);
  const handleTabChange = (val) => {
    if (val === 3) {
      if (summarySelected) return;
      onTabChange(true);
      setSummarySelected(true);
      toggleSearched(false);
    }
    if (summarySelected) {
      onTabChange(false);
      setSummarySelected(false);
    }
  };

  return (
    <Box>
      <Flex justifyContent='center'>
        <Tabs align='center' width='100%'>
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
              {selectedCard ? (
                <SelectedCard
                  addSelectedCard={addSelectedCard}
                  {...selectedCard}
                  handleCardClick={handleCardClick}
                  tripType={tripType}
                />
              ) : (
                <Places
                  tripType={tripType}
                  {...placesProps}
                  handleCardClick={handleCardClick}
                />
              )}
            </TabPanel>
            <TabPanel paddingX={2}>
              <MultiDaypicker dates={selectedDates} setDates={setDates} />
            </TabPanel>
            <TabPanel paddingX={2}>
              <Summary
                customName={customName}
                hasSearched={hasSearched}
                minimumNights={editingTripRequest?.min_nights}
                saveTripRequest={saveTripRequest}
                selectedDates={selectedDates}
                selectedPlaces={selectedPlaces}
                setName={setName}
                toggleSearched={toggleSearched}
                tripType={tripType}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};
