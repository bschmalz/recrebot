import React, { useState } from 'react';
import Image from 'next/image';
import { Box } from '@chakra-ui/layout';

interface SelectedPlaceImageProps {
  src: string;
  alt: string;
}

export const SelectedPlaceImage: React.FC<SelectedPlaceImageProps> = ({
  src,
  alt,
}) => {
  const [error, setError] = useState(false);
  return (
    <Box width={265} height={185} position='relative'>
      <Image
        src={error ? '/defaultPlace.png' : src}
        alt={alt}
        width={265}
        height={185}
        layout='fill'
        objectFit='contain'
        onError={() => setError(true)}
      />
    </Box>
  );
};
