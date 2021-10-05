import { Box } from '@chakra-ui/layout';
import { ErrorMessage } from 'formik';
import React from 'react';
import { ErrorContainer } from '../components/ErrorContainer';

const Offline: React.FC = () => {
  return (
    <Box height='100vh' width='100vw'>
      <ErrorContainer message='You are currently offline. Get to the internet!' />
    </Box>
  );
};

export default Offline;
