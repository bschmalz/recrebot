import { Flex } from '@chakra-ui/react';
import React from 'react';
import { ErrorFallback } from './ErrorFallback';

export type WrapperVariant = 'small' | 'regular' | 'large';

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  let size;
  if (variant === 'large') {
    size = '2000px';
  } else if (variant === 'regular') {
    size = '1600px';
  } else {
    size = '400px';
  }
  return (
    <Flex maxW={size} w='100%' mx='auto' h='calc(100% - 51px)'>
      <ErrorFallback showFullError>{children}</ErrorFallback>
    </Flex>
  );
};
