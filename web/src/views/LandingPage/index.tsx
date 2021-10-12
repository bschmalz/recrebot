import { Box } from '@chakra-ui/layout';
import React from 'react';
import { Ipad } from './Ipad';

export const LandingPage = () => {
  return (
    <Box
      position='relative'
      backgroundAttachment='fixed'
      backgroundPosition='top'
      backgroundRepeat='no-repeat'
      minHeight='100%'
      backgroundImage='url(matlock.jpg)'
      width='100%'
      transition=''
      backgroundSize='cover'
    >
      <Ipad />
    </Box>
  );
};
