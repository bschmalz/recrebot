import { Box } from '@chakra-ui/react';
import React from 'react';

export const FormWrapper = ({ children, ...props }) => {
  return (
    <Box
      backgroundColor='rgba(190, 210, 210, 0.2)'
      padding={4}
      borderRadius='5px'
      width='100%'
      mx={6}
      {...props}
    >
      {children}
    </Box>
  );
};
