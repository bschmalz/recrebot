import { IconButton, ListItem, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { StyledContainer } from './StyledContainer';
import { MdAddCircle } from 'react-icons/md';
import { useSelectedPlaces } from '../contexts/SelectedPlacesContext';
import { useMap } from '../contexts/MapContext';
import { useTripType } from '../contexts/TripTypeContext';
import { useMain } from '../contexts/MainContext';
import { useSearchLocations } from '../contexts/SearchLocationsContext';

interface PlaceProps {
  facility_id?: string;
  latitude: number;
  longitude: number;
  legacy_id: string;
  name: string;
  id: number;
  parent_name: string;
  subparent_id?: string;
  sub_type?: string;
}

export const Place: React.FC<PlaceProps> = (props) => {
  const { id, name, parent_name } = props;
  const { addSelectedPlace, selectCard } = useSelectedPlaces();
  const { campgrounds, trailheads } = useSearchLocations();
  const { removeMarker, updateMapMarkers, zoomOnSelectedCard } = useMap();
  const { scrollRef, sideBarRef } = useMain();
  const { tripType } = useTripType();
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

  const handleCardClick = (id) => {
    if (!id) {
      selectCard(null);
      requestAnimationFrame(() => {
        sideBarRef.current.scrollTop = scrollRef.current;
        const markers = tripType === 'Camp' ? campgrounds : trailheads;
        updateMapMarkers(markers);
      });
      return;
    }
    let item, type;
    if (tripType === 'Camp') {
      item = campgrounds.find((cg) => cg.id === id);
      type = 'campground';
    } else {
      item = trailheads.find((th) => th.id === id);
      type = 'trailhead';
    }
    scrollRef.current = sideBarRef.current.scrollTop;
    sideBarRef.current.scrollTop = 170;
    selectCard({ ...item, type });
    zoomOnSelectedCard(item);
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
            addSelectedPlace(props);
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
