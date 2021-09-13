import { IconButton, ListItem, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { StyledContainer } from '../../components/StyledContainer';
import { MdAddCircle } from 'react-icons/md';

export interface PlaceInterface {
  addSelectedPlace: Function;
  handleCardClick: Function;
  handleCardMouseEnter: Function;
  handleCardMouseLeave: Function;
  tripType: string;
}

interface PlaceProps extends PlaceInterface {
  latitude: number;
  longitude: number;
  name: string;
  id: number;
  recarea_name: string;
}

export const Place: React.FC<PlaceProps> = ({
  addSelectedPlace,
  handleCardClick,
  handleCardMouseEnter,
  handleCardMouseLeave,
  latitude,
  longitude,
  id,
  name,
  recarea_name,
  tripType,
}) => {
  const [isActive, setActive] = useState(false);
  const [isFocused, setFocus] = useState(false);
  const buttonRef = useRef<HTMLInputElement>(null);

  const blurCard = () => {
    if (!isFocused && buttonRef?.current?.focus) {
      setFocus(true);
      buttonRef.current.focus();
    } else {
      setFocus(false);
      handleCardMouseLeave(id);
    }
  };

  const focusCard = () => {
    setActive(true);
    handleCardMouseEnter(id);
  };

  const onMouseEnter = () => {
    setActive(true);
    handleCardMouseEnter(id);
  };

  const onMouseLeave = () => {
    setActive(false);
    handleCardMouseLeave(id);
  };

  return (
    <ListItem key={id} position='relative'>
      <StyledContainer
        onBlur={blurCard}
        onClick={() => handleCardClick(id)}
        onFocus={focusCard}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        key={id}
        tabIndex={0}
        padding={1}
        cursor='pointer'
        bg='white'
        borderRadius={6}
        position='relative'
      >
        <Text fontSize='small' fontWeight='bold'>
          {name}
        </Text>
        <Text fontSize='small'>{recarea_name}</Text>
        {isActive && (
          <IconButton
            colorScheme='green'
            onBlur={() => {
              setActive(false);
            }}
            onClick={(e) => {
              e.stopPropagation();
              addSelectedPlace({
                id,
                name,
                recarea_name,
                latitude,
                longitude,
                type: tripType,
              });
            }}
            ref={buttonRef}
            size='xs'
            position='absolute'
            bottom={3}
            right={1.5}
            aria-label={tripType === 'Camp' ? 'Add Camground' : 'Add Trailhead'}
            icon={<MdAddCircle size={18} />}
            isRound={true}
          />
        )}
      </StyledContainer>
    </ListItem>
  );
};
