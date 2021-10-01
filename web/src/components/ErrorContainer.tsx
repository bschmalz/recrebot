import { Box, Flex, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import React from 'react';

interface ErrorContainerProps {
  message?: string;
}

export const ErrorContainer: React.FC<ErrorContainerProps> = ({
  message = 'We seem to have run into an error. Sorry about that!',
}) => {
  return (
    <Flex w='100%' h='100%' position='relative'>
      <Box
        position='absolute'
        w='100%'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        textAlign='center'
      >
        <Box>
          <Image
            borderRadius='full'
            boxSize='350px'
            src='/whoops.jpeg'
            alt='Whoops'
            display='inline'
            mb={2}
          />
          <Text>{message}</Text>
        </Box>
      </Box>
    </Flex>
  );
};
