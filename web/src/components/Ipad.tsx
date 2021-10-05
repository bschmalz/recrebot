import { Image } from '@chakra-ui/image';
import { Box } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/media-query';
import React, { useEffect, useRef, useState } from 'react';
import { isServer } from '../utils/isServer';
import { delay } from '../utils/delay';
import { Slide } from '@chakra-ui/transition';

interface IpadProps {}

const images = [
  'screen1.png',
  'screen2.png',
  'screen3.png',
  'screen4.png',
  'screen5.png',
  'screen6.png',
  'screen7.png',
  'screen8.png',
  'screen9.png',
];

export const Ipad: React.FC<IpadProps> = ({}) => {
  const [isOpen, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const indexRef = useRef(0);
  useEffect(() => {
    startImages();
  }, []);

  const startImages = async () => {
    await delay(250, 250);
    setOpen(true);
    await delay(1500, 1500);
    setOpacity(1);
    delay(500, 500);
    setTextOpacity(1);
    swapImage();
  };

  const swapImage = async () => {
    await delay(3000, 4000);
    setOpacity(0);
    await delay(1000, 1000);
    if (indexRef.current === images.length - 1) {
      indexRef.current = 0;
      setIndex(0);
    } else {
      const newIndex = indexRef.current + 1;
      indexRef.current = newIndex;
      setIndex(newIndex);
    }
    setOpacity(1);
    swapImage();
  };

  const [isLarge] = useMediaQuery('(min-width: 1600px)');
  const [isMedium] = useMediaQuery('(min-width: 660px)');
  if (isServer()) {
    return <></>;
  }

  if (isLarge) {
    return (
      <Slide direction='right' in={isOpen} style={{ zIndex: 10 }}>
        <Box position='absolute' top='25%' right='15%'>
          <Image
            position='relative'
            src='ipad.png'
            background='rgba(0, 0, 0, 100)'
            borderRadius='40px'
            minWidth='1000px'
          ></Image>
          <Image
            position='absolute'
            src={images[index]}
            top='44px'
            left='88px'
            maxWidth='847px'
            opacity={opacity}
            transition='opacity .5s'
          ></Image>
          <Box
            position='absolute'
            left={'-550px'}
            top={'50%'}
            bottom={'-100px'}
            transform={'translateY(-50%)'}
            color='white'
            background='rgba(22, 22, 22, 0.3)'
            fontSize={'36px'}
            padding={'0 20px'}
            borderRadius='5px'
            opacity={textOpacity}
            transition='opacity .5s linear'
            minWidth={'400px'}
            maxWidth={'30%'}
            display='inline'
            textAlign='center'
            maxHeight='180px'
          >
            Spend less time planning, and more time travelling.
          </Box>
        </Box>
      </Slide>
    );
  } else if (isMedium) {
    return (
      <Slide direction='right' in={isOpen} style={{ zIndex: 10 }}>
        <Box
          position='absolute'
          top='100px'
          right='50%'
          transform='translate(50%, 0%)'
        >
          <Image
            position='relative'
            src='ipad.png'
            maxWidth='661px'
            minWidth='661px'
            background='rgba(0, 0, 0, 100)'
            borderRadius='27px'
          ></Image>
          <Image
            position='absolute'
            src={images[index]}
            top='29px'
            left={58}
            maxWidth='545px'
            opacity={opacity}
            transition='opacity .5s'
          ></Image>
          <Box
            position='absolute'
            left={'50%'}
            bottom={'-150px'}
            transform={'translateX(-50%)'}
            color='white'
            background='rgba(22, 22, 22, 0.3)'
            fontSize={'32px'}
            padding={'0 20px'}
            borderRadius='5px'
            opacity={textOpacity}
            transition='opacity .5s linear'
            width='auto'
            minWidth='600px'
            maxWidth={'90%'}
            display='inline'
            textAlign='center'
          >
            Spend less time planning, and more time travelling.
          </Box>
        </Box>
      </Slide>
    );
  } else {
    return (
      <Box
        position='absolute'
        top='25%'
        right='50%'
        transform='translate(50%, -25%)'
      >
        <Image
          position='relative'
          src='ipad.png'
          minWidth='333px'
          background='rgba(0, 0, 0, 100)'
          borderRadius='15px'
        ></Image>
        <Image
          position='absolute'
          src={images[index]}
          top='13px'
          left='26px'
          maxWidth='280px'
          opacity={1}
          transition='opacity .5s'
        ></Image>
        <Box
          position='absolute'
          left={'50%'}
          bottom={'-200px'}
          transform={'translateX(-50%)'}
          color='white'
          background='rgba(22, 22, 22, 0.3)'
          fontSize={'28px'}
          padding={0}
          borderRadius='5px'
          opacity={textOpacity}
          transition='opacity .5s linear'
          width='auto'
          minWidth='300px'
          maxWidth={'90%'}
          display='inline'
          textAlign='center'
        >
          Spend less time planning, and more time travelling.
        </Box>
      </Box>
    );
  }
};
