import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Link,
  List,
  ListItem,
  Text,
} from '@chakra-ui/layout';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/number-input';
import { Tag } from '@chakra-ui/tag';
import React, { useState } from 'react';
import { SelectedPlaceInterface } from '.';
import { StyledContainer } from '../../components/StyledContainer';
import { checkTripRequest } from '../../utils/checkTripRequest';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

export interface SummaryInterface {
  customName: string;
  saveTripRequest: Function;
  selectedDates: Date[];
  selectedPlaces: SelectedPlaceInterface[];
  setName: (id: string) => void;
  tripType: 'Camp' | 'Hike';
}

interface Props extends SummaryInterface {
  hasSearched: boolean;
  minimumNights?: number;
  toggleSearched: Function;
}

const dateNumToStr = {
  1: 'Jan',
  2: 'Feb',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'Aug',
  9: 'Sept',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

export const Summary: React.FC<Props> = ({
  customName,
  hasSearched,
  minimumNights = '1',
  saveTripRequest,
  selectedDates,
  selectedPlaces,
  setName,
  toggleSearched,
  tripType,
}) => {
  const toast = useToast();
  const [minNights, setNights] = useState(minimumNights?.toString() || '1');
  const [results, setResults] = useState({});
  const [checking, setChecking] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleTripCheck = async () => {
    setChecking(true);
    const res = await checkTripRequest({
      type: tripType,
      dates: selectedDates,
      locations: selectedPlaces,
      min_nights: parseInt(minNights),
    });
    if (res && Object.keys(res).length) {
      setResults(res);
      onOpen();
    } else {
      toggleSearched(true);
      toast({
        title: 'No matches found.',
        description:
          'We searched all the locations and dates you entered and found no current availability.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
    setChecking(false);
  };

  return (
    <>
      <form>
        <StyledContainer
          borderRadius={6}
          padding={4}
          backgroundColor='white'
          textAlign='left'
        >
          <Box marginBottom={6}>
            <Text
              fontSize={14}
              color='gray.600'
              fontWeight='bold'
              minWidth='160px'
              marginLeft={1}
              marginBottom={1}
            >
              Custom Name (optional)
            </Text>
            <Input
              value={customName}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <TripSelections
            dates={selectedDates}
            places={selectedPlaces}
            tripType={tripType}
          />
          {tripType === 'Camp' ? (
            <Box marginBottom={6}>
              <Flex alignItems='center'>
                <Text
                  fontSize={14}
                  color='gray.600'
                  fontWeight='bold'
                  minWidth='200px'
                >
                  Minimum Number of Nights
                </Text>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={13}
                  value={minNights}
                  onChange={(num) => {
                    toggleSearched(false);
                    setNights(num);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </Box>
          ) : null}

          {!hasSearched ? (
            <>
              <Button
                mb={3}
                size='md'
                width='100%'
                onClick={handleTripCheck}
                isLoading={checking}
              >
                {checking ? 'Checking' : 'Check Current Status'}
              </Button>
              <Text fontSize={12} textAlign='center'>
                Trips must be checked prior to saving.
              </Text>
            </>
          ) : (
            <Button
              colorScheme='green'
              disabled={!hasSearched}
              size='md'
              width='100%'
              onClick={() =>
                saveTripRequest(
                  customName,
                  tripType === 'Camp' ? minNights : undefined
                )
              }
            >
              Save
            </Button>
          )}
        </StyledContainer>
      </form>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader pb={3}>Search Results</ModalHeader>
            <ModalBody px={4} py={0}>
              <Text fontSize={14}>
                We found matches on the following combinations.
              </Text>
              <List>
                <Divider marginTop={2} />
                {Object.keys(results).map((name) => {
                  return (
                    <>
                      <ListItem key={name} my={2}>
                        <Text fontSize={14}>
                          <Link href={results[name].url} target='_blank'>
                            <Tag size='md' variant='solid'>
                              {name}
                            </Tag>
                          </Link>
                          <Box as='span' ml={2}>
                            {results[name].dates.map((d, i) => {
                              return `${d.format('MM/DD')}${
                                i !== results[name].dates.length - 1 ? ', ' : ''
                              }`;
                            })}{' '}
                          </Box>
                        </Text>
                      </ListItem>
                      <Divider />
                    </>
                  );
                })}
              </List>
              <Text mt={3} fontSize={14}>
                Trips with matches are not able to saved. Consider booking your
                reservation now.
              </Text>
            </ModalBody>

            <Center p={6}>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Got It
              </Button>
            </Center>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export const TripSelections = ({ dates, places, tripType }) => {
  const dateObj = {};

  const datesToObj = () => {
    dates.forEach((sdate) => {
      const sd = new Date(sdate);
      const month = sd.getMonth() + 1;
      const date = sd.getDate();
      if (!dateObj[month]) {
        dateObj[month] = {};
      }
      dateObj[month][date] = true;
    });
  };

  const renderDates = () => {
    datesToObj();

    const monthKeys = Object.keys(dateObj);
    return monthKeys.map((mk, i) => {
      const data = dateObj[mk];
      return (
        <Box marginBottom={2} marginTop={2} key={mk}>
          <Flex alignItems='center' flexWrap='wrap'>
            <Text fontSize={13}>
              <Badge marginRight={1}>{dateNumToStr[mk]}</Badge>
              {renderMonth(data)}
            </Text>
          </Flex>
          {i !== monthKeys.length - 1 ? (
            <Divider marginBottom={1} marginTop={2} />
          ) : null}
        </Box>
      );
    });
  };

  /*
  renderMonth

  convert this: {
    1: {
      22: true,
      23: true,
      27: true
    },
    4: {
      2: true
    }
  } 

  to: 

  Jan: 22-23, 27
  April: 02
  */

  const renderMonth = (m) => {
    let objIndex = 0;
    const days = Object.keys(m);

    const groupedDateObj = [
      {
        start: days[objIndex],
        end: days[objIndex],
      },
    ];

    for (let i = 1; i < days.length; i++) {
      if (parseInt(days[i]) == parseInt(groupedDateObj[objIndex].end) + 1) {
        groupedDateObj[objIndex].end = days[i];
      } else {
        objIndex = objIndex + 1;
        groupedDateObj.push({
          start: days[i],
          end: days[i],
        });
      }
    }

    return groupedDateObj.map((d, i) => {
      let res = '';
      if (d.end === d.start) res = d.start;
      else res = `${d.start} - ${d.end}`;
      if (i === groupedDateObj.length - 1) return res;
      else return res + ', ';
    });
  };
  return (
    <>
      <Box marginBottom={6}>
        <Text fontSize={14} color='gray.600' fontWeight='bold'>
          Selected {tripType === 'Hike' ? 'Trailheads' : 'Campsites'}
        </Text>
        <Divider marginTop={1} marginBottom={2} />

        <Flex flexWrap='wrap'>
          {places.map((sp) => (
            <Tag
              size='md'
              key={sp.id}
              variant='solid'
              marginRight={0.5}
              marginBottom={1}
            >
              {sp.name}
            </Tag>
          ))}
        </Flex>
      </Box>
      <Box marginBottom={6}>
        <Text
          fontSize={14}
          color='gray.600'
          fontWeight='bold'
          marginLeft={1}
          marginBottom={1}
        >
          Seleted Dates
        </Text>
        <Divider marginTop={1} marginBottom={2} />
        {renderDates()}
      </Box>
    </>
  );
};
