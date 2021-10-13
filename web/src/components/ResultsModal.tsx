import { Button } from '@chakra-ui/button';
import {
  List,
  Divider,
  ListItem,
  Link,
  Box,
  Center,
  Text,
} from '@chakra-ui/layout';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/modal';
import { Tag } from '@chakra-ui/tag';
import dayjs from 'dayjs';
import React from 'react';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    [key: string]: {
      url: string;
      dates: number[];
    };
  };
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  results,
}) => {
  return (
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
                      <Link
                        href={results[name].url}
                        target='_blank'
                        display='inline-flex'
                        borderRadius='6px'
                      >
                        <Tag size='md' variant='solid'>
                          {name}
                        </Tag>
                      </Link>
                      <Box as='span' ml={2}>
                        {results[name].dates
                          .sort((a, b) => a - b)
                          .map((d, i) => {
                            return `${dayjs(d).format('MM/DD')}${
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
  );
};
