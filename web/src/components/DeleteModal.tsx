import { Button } from '@chakra-ui/button';
import { Center, Text } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/modal';
import React from 'react';

interface DeleteModalProps {
  delete: (id: number) => void;
  deletingId: number;
  isOpen: boolean;
  modalText?: string;
  onClose: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  delete: deleteItem,
  deletingId,
  isOpen,
  modalText,
  onClose,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent padding={4}>
          <ModalBody margin={3}>
            <Center>
              <Text>
                {modalText || 'Are you sure you want to delete this item?'}
              </Text>
            </Center>
          </ModalBody>

          <Center>
            <Button mr={6} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='red' onClick={() => deleteItem(deletingId)}>
              Delete
            </Button>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};
