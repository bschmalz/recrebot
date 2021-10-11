import { Box } from '@chakra-ui/react';
import React from 'react';
import { Navbar } from './Navbar';
import { Wrapper, WrapperVariant } from './Wrapper';

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <Box h='100vh' overflow='hidden' bg='rgba(210, 220, 240, 0.2)'>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </Box>
  );
};
