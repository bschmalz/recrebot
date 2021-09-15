import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Flex,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { TripRequestResponse } from './types/TripRequestResponse';
import { FaWalking, FaCampground } from 'react-icons/fa';
import { renderDate } from '../../utils/renderDate';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { DeleteModal } from '../../components/DeleteModal';
import { TripSelections } from './Summary';

interface MyTripsProps {
  deleteTripRequest: Function;
  tripRequests: TripRequestResponse[] | null;
  error: Error;
  loading: boolean;
}

const renderText = (custom_name: string, dates: Date[]) => {
  if (custom_name) return custom_name;
  else {
    if (dates.length === 1) {
      return renderDate(dates[0]);
    } else {
      return `${renderDate(dates[0])} -  ${renderDate(dates.length - 1)}`;
    }
  }
};

export const MyTrips: React.FC<MyTripsProps> = ({
  deleteTripRequest,
  error,
  loading,
  tripRequests,
}) => {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const handleDeleteModalClose = () => {
    closeDeleteModal();
    setDeletingId(null);
  };

  const handleDeleteModalOpen = (id) => {
    setDeletingId(id);
    openDeleteModal();
  };

  const selectedTripRequest =
    editingId === null ? null : tripRequests.find(({ id }) => id === editingId);

  return (
    <>
      <Flex justifyContent='center'>
        {loading ? (
          <Box textAlign='center'>
            <Spinner
              thickness='2px'
              speed='0.65s'
              emptyColor='gray.200'
              color='green.700'
              size='lg'
              marginTop={4}
            />
            <Text>Loading Trips</Text>
          </Box>
        ) : null}
        {error ? <Text>There was an error fetching trip requests.</Text> : null}
        {selectedTripRequest ? <Box>Heyo</Box> : null}
        {!tripRequests?.length ? (
          <Text>It looks like you haven't planned any trips yet.</Text>
        ) : (
          <Accordion width='100%' backgroundColor='white' allowToggle>
            {tripRequests.map(({ custom_name, id, dates, locations, type }) => {
              const Icon = type === 'Hike' ? FaWalking : FaCampground;
              return (
                <AccordionItem allowToggle>
                  <AccordionButton width='100%' p={2}>
                    <Flex
                      alignContent='center'
                      justifyContent='space-between'
                      width='100%'
                    >
                      <Flex marginTop={2} marginBottom={2} alignItems='center'>
                        <Icon fontSize={28} color='green' />

                        <Text marginLeft={2}>
                          {renderText(custom_name, dates)}
                        </Text>
                      </Flex>
                      <Flex padding={2} paddingLeft={4}>
                        <IconButton
                          aria-label='Delete Trip'
                          color='red.400'
                          icon={<MdDeleteForever size={24} />}
                          isRound
                          onClick={() => {
                            handleDeleteModalOpen(id);
                          }}
                        />
                        <IconButton
                          aria-label='Edit Trip'
                          color='gray.600'
                          icon={<MdEdit size={24} />}
                          isRound
                          marginLeft={2}
                          onClick={() => {
                            console.log('huh');
                          }}
                        />
                      </Flex>
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel pb={0} pt={4}>
                    <TripSelections
                      dates={dates}
                      places={locations}
                      tripType={type}
                    />
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </Flex>
      {isDeleteModalOpen ? (
        <DeleteModal
          delete={deleteTripRequest}
          deletingId={deletingId}
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
        />
      ) : null}
    </>
  );
};
