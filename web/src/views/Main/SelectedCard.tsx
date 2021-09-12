import { IconButton } from '@chakra-ui/button';
import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import React from 'react';
import { StyledContainer } from '../../components/StyledContainer';
import { MdAddCircle, MdArrowBack } from 'react-icons/md';

interface SelectedCardProps {
  addSelectedPlace: Function;
  id: number;
  handleCardClick: Function;
  legacy_id: number;
  name: string;
  recarea_name: string;
  type: string;
  source: string;
  district?: string;
  description: string;
  facility_id?: string;
  latitude: number;
  longitude: number;
  tripType: string;
}

export const SelectedCard: React.FC<SelectedCardProps> = ({
  addSelectedPlace,
  facility_id,
  handleCardClick,
  id,
  latitude,
  legacy_id,
  longitude,
  name,
  recarea_name,
  type,
  source,
  district,
  description,
  tripType,
}) => {
  const createMarkup = () => {
    return { __html: description };
  };

  const renderLinkHref = () => {
    if (type === 'trailhead') {
      return renderRGTrailhead();
    } else {
      if (source === 'rc') return renderCACamp();
      else return renderRGCamp();
    }
  };

  const renderCACamp = () => {
    return `https://www.reservecalifornia.com/Web/#!park/${legacy_id}`;
  };

  const renderRGCamp = () => {
    return `https://www.recreation.gov/camping/campgrounds/${legacy_id}`;
  };

  const renderRGTrailhead = () => {
    return `https://www.recreation.gov/permits/${facility_id}`;
  };

  return (
    <StyledContainer
      padding={6}
      paddingTop={8}
      bg='white'
      borderRadius={6}
      position='relative'
    >
      <IconButton
        aria-label='Back To Search Results'
        icon={<MdArrowBack />}
        isRound
        position='absolute'
        onClick={() => handleCardClick(null)}
        size='lg'
        minWidth='35px'
        maxHeight='35px'
        top={0}
        left={0}
        variant='ghost'
      />
      <img src={`/${type}/${id}.png`} alt={`Picture of ${name}`} />
      <Box marginTop={3} textAlign='left'>
        <Heading as='h1' size='md'>
          {name}
        </Heading>
        {recarea_name ? (
          <Text fontSize='sm'>
            {recarea_name}
            {district ? `, ${district}` : ''}
          </Text>
        ) : null}
        <Text fontSize='sm'>
          <Link href={renderLinkHref()} target='_blank'>
            Reservation Page
          </Link>
        </Text>

        <IconButton
          colorScheme='green'
          onClick={() =>
            addSelectedPlace({
              id,
              name,
              recarea_name,
              latitude,
              longitude,
              type: tripType,
            })
          }
          size='xs'
          position='absolute'
          bottom={2.5}
          right={1.5}
          aria-label={tripType === 'Camp' ? 'Add Camground' : 'Add Trailhead'}
          icon={<MdAddCircle size={18} />}
          isRound={true}
        />
        {description ? (
          <Box
            className='recrebot-innerhtml'
            dangerouslySetInnerHTML={createMarkup()}
            marginTop={2}
          />
        ) : null}
      </Box>
    </StyledContainer>
  );
};
