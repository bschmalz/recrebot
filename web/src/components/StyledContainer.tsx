import { Container } from '@chakra-ui/react';
import React from 'react';

export const StyledContainer = ({ children, ...props }) => {
  return (
    <Container
      {...props}
      boxShadow="0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
    >
      {children}
    </Container>
  );
};
