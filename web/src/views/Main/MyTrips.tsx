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
import { FaWalking, FaCampground } from 'react-icons/fa';
import { renderDate } from '../../utils/renderDate';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { DeleteModal } from '../../components/DeleteModal';
import { TripSelections } from '../../components/Summary';
import { useSelectedPlaces } from '../../contexts/SelectedPlacesContext';
import { useTripRequests } from '../../contexts/TripRequestsContext';
import { useTripType } from '../../contexts/TripTypeContext';

const renderText = (custom_name: string, dates: Date[]) => {
  if (custom_name) return custom_name;
  else {
    if (dates.length === 1) {
      return renderDate(dates[0]);
    } else {
      const sortedDates = [...dates].sort();
      return `${renderDate(sortedDates[0])} -  ${renderDate(
        sortedDates[dates.length - 1]
      )}`;
    }
  }
};

export const MyTrips: React.FC = () => {
  const { setTripType } = useTripType();

  const { setDates, setSelectedPlaces } = useSelectedPlaces();

  const {
    deleteTripRequest,
    loadingTripRequests,
    errorTripRequests,
    tripRequests,
    setCustomName,
    setEditingTripRequest,
  } = useTripRequests();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = () => {
    deleteTripRequest(deletingId);
    handleDeleteModalClose();
  };

  const handleDeleteModalClose = () => {
    closeDeleteModal();
    setDeletingId(null);
  };

  const handleDeleteModalOpen = (id) => {
    setDeletingId(id);
    openDeleteModal();
  };

  const handleEditTripRequest = (tr) => {
    setSelectedPlaces(tr.locations);
    setCustomName(tr.custom_name);
    setDates(tr.dates.map((d) => new Date(d)));
    setEditingTripRequest(tr);
    setTripType(tr.type);
  };

  const renderBody = () => {
    if (loadingTripRequests)
      return (
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
      );

    if (errorTripRequests)
      return <Text>There was an error fetching trip requests.</Text>;

    return !tripRequests.length ? (
      <Text>It looks like you haven't planned any trips yet.</Text>
    ) : (
      <Accordion width='100%' backgroundColor='white' allowToggle>
        {tripRequests.map((tr) => {
          const { custom_name, id, dates, locations, type } = tr;
          const Icon = type === 'Hike' ? FaWalking : FaCampground;
          return (
            <AccordionItem allowToggle key={tr.id}>
              <AccordionButton width='100%' p={2}>
                <Flex
                  alignContent='center'
                  justifyContent='space-between'
                  width='100%'
                >
                  <Flex marginTop={2} marginBottom={2} alignItems='center'>
                    <Icon fontSize={28} color='green' />

                    <Text marginLeft={2}>{renderText(custom_name, dates)}</Text>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTripRequest(tr);
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
    );
  };

  return (
    <>
      <Flex justifyContent='center'>{renderBody()}</Flex>
      {isDeleteModalOpen ? (
        <DeleteModal
          delete={handleDelete}
          deletingId={deletingId}
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
        />
      ) : null}
    </>
  );
};
