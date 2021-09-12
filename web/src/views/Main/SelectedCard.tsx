import { IconButton } from '@chakra-ui/button';
import { Box, Heading, Link, Text } from '@chakra-ui/layout';
import React from 'react';
import { StyledContainer } from '../../components/StyledContainer';
import { MdArrowBack } from 'react-icons/md';

interface SelectedCardProps {
  id: number;
  legacy_id: number;
  name: string;
  recarea_name: string;
  type: string;
  source: string;
  district?: string;
  description: string;
  facility_id?: string;
}

export const SelectedCard: React.FC<SelectedCardProps> = ({
  facility_id,
  id,
  legacy_id,
  name,
  recarea_name,
  type,
  source,
  district,
  description,
}) => {
  console.log('facility', facility_id);
  const createMarkup = () => {
    return { __html: description };
  };

  console.log('legacyid', legacy_id, type);

  ('https://www.recreation.gov/camping/campgrounds/233404');
  ('https://www.recreation.gov/permits/233262');
  ('https://www.reservecalifornia.com/Web/#!park/7');

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
      bg="white"
      borderRadius={6}
      position="relative"
    >
      <IconButton
        aria-label="Back To Search Results"
        icon={<MdArrowBack />}
        isRound
        position="absolute"
        size="lg"
        minWidth="35px"
        maxHeight="35px"
        top={0}
        left={0}
        variant="ghost"
      />
      <img src={`/${type}/${id}.png`} alt={`Picture of ${name}`} />
      <Box marginTop={3} textAlign="left">
        <Heading as="h1" size="md">
          {name}
        </Heading>
        {recarea_name ? (
          <Text fontSize="sm">
            {recarea_name}
            {district ? `, ${district}` : ''}
          </Text>
        ) : null}
        <Text fontSize="sm">
          <Link href={renderLinkHref()} target="_blank">
            Reservation Page
          </Link>
        </Text>
        {description ? (
          <Box
            className="recrebot-innerhtml"
            dangerouslySetInnerHTML={createMarkup()}
            marginTop={2}
          />
        ) : null}
      </Box>
    </StyledContainer>
  );
};
