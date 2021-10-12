import React, { useState } from 'react';
import { Box, Image } from '@chakra-ui/react';

interface SelectedPlaceImageProps {
  src: string;
  alt: string;
}

export const SelectedPlaceImage: React.FC<SelectedPlaceImageProps> = ({
  src,
  alt,
}) => {
  const [isInErrorState, setError] = useState(false);
  return (
    <Box>
      <Image
        src={src}
        fallbackSrc={isInErrorState ? '/defaultPlace.png' : ''}
        height={isInErrorState ? '185px' : undefined}
        width={isInErrorState ? '265px' : undefined}
        minHeight={'185px'}
        alt={alt}
        onError={() => setError(true)}
      />
    </Box>
  );
};
