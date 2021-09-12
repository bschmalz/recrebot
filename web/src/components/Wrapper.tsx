import { Flex } from '@chakra-ui/react';
import React from 'react';

export type WrapperVariant = 'small' | 'regular';

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  return (
    <Flex
      maxW={variant === 'regular' ? '1600px' : '400px'}
      w="100%"
      mx="auto"
      h="calc(100% - 51px)"
    >
      {children}
    </Flex>
  );
};
