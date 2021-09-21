import { IconButton, ListItem, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { StyledContainer } from './StyledContainer';
import { MdAddCircle } from 'react-icons/md';
import { useSelectedPlaces } from '../contexts/SelectedPlacesContext';
import { useMap } from '../contexts/MapContext';

export interface PlaceInterface {
  handleCardClick: Function;
}

interface PlaceProps extends PlaceInterface {
  latitude: number;
  longitude: number;
  legacy_id: string;
  name: string;
  id: number;
  parent_name: string;
  subparent_id?: string;
  sub_type?: string;
  tripType: string;
}

export const Place: React.FC<PlaceProps> = ({
  handleCardClick,
  legacy_id,
  latitude,
  longitude,
  id,
  name,
  parent_name,
  subparent_id,
  sub_type,
  tripType,
}) => {
  const { addSelectedPlace } = useSelectedPlaces();
  const { removeMarker } = useMap();
  const {
    highlightMouseMarker,

    unhighlightMouseMarker,
  } = useMap();
  const [isActive, setActive] = useState(false);
  const [isFocused, setFocus] = useState(false);
  const buttonRef = useRef<HTMLInputElement>(null);

  const blurCard = () => {
    if (!isFocused && buttonRef?.current?.focus) {
      setFocus(true);
      buttonRef.current.focus();
    } else {
      setFocus(false);
      unhighlightMouseMarker(id);
    }
  };

  const focusCard = () => {
    setActive(true);
    highlightMouseMarker(id);
  };

  const onMouseEnter = () => {
    setActive(true);
    highlightMouseMarker(id);
  };

  const onMouseLeave = () => {
    setActive(false);
    unhighlightMouseMarker(id);
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
        className='recrebot-search-result'
      >
        <Text fontSize='small' fontWeight='bold'>
          {name}
        </Text>
        <Text fontSize='small'>{parent_name}</Text>
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
              parent_name,
              legacy_id,
              latitude,
              longitude,
              subparent_id,
              sub_type,
              type: tripType,
            });
            removeMarker(id);
          }}
          display={!isActive ? 'none' : undefined}
          ref={buttonRef}
          size='xs'
          position='absolute'
          bottom={3}
          right={1.5}
          aria-label={tripType === 'Camp' ? 'Add Camground' : 'Add Trailhead'}
          icon={<MdAddCircle size={18} />}
          isRound={true}
        />
      </StyledContainer>
    </ListItem>
  );
};
