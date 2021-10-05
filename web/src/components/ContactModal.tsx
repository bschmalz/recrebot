import React from 'react';
import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/modal';
import { Box, ModalHeader, useToast } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { sendMessage } from '../utils/sendMessage';
import { toErrorMap } from '../utils/toErrorMap';
import { FormWrapper } from './FormWrapper';
import { InputField } from './InputField';

interface ContactModalProps {
  isModalOpen: boolean;
  handleModalClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isModalOpen,
  handleModalClose,
}) => {
  const toast = useToast();
  return (
    <Modal isOpen={isModalOpen} onClose={handleModalClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Send Us A Message</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{ email: '', subject: '', message: '' }}
            onSubmit={async (values, { setErrors }) => {
              let res;
              try {
                res = await sendMessage(values).then((res) => res.json());
              } catch (e) {
                toast({
                  title: 'Error sending message.',
                  description:
                    "I'd say send us a message to let us know but hmm......",
                  status: 'error',
                  duration: 4000,
                  isClosable: true,
                });
              }

              if (res?.errors) {
                setErrors(toErrorMap(res.errors));
              } else if (res.success) {
                toast({
                  title: 'Message sent.',
                  description: 'Thanks for reaching out!',
                  duration: 4000,
                  isClosable: true,
                });
                handleModalClose();
              }
            }}
          >
            {({ values, handleChange, isSubmitting }) => (
              <FormWrapper mb={2}>
                <Form>
                  <Box>
                    <InputField
                      type='email'
                      name='email'
                      placeholder='email'
                      label='Email'
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField
                      name='subject'
                      placeholder='subject'
                      label='Subject'
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField
                      textarea
                      name='message'
                      placeholder='message'
                      label='Message'
                    />
                  </Box>
                  <Box textAlign='right'>
                    <Button
                      type='submit'
                      mt={4}
                      isLoading={isSubmitting}
                      colorScheme='teal'
                    >
                      Send
                    </Button>
                  </Box>
                </Form>
              </FormWrapper>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
