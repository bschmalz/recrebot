import { Input, List, Spinner } from '@chakra-ui/react';
import React from 'react';

import { Campground } from './types/Campground';
import { Trailhead } from './types/Trailhead';
import { Place, PlaceInterface } from './Place';

export interface PlacesInterface extends PlaceInterface {
  campgrounds: Campground[];
  loadingCampgrounds: boolean;
  loadingTrailheads: boolean;
  onSearchTextChange: Function;
  searchText: string;
  trailheads: Trailhead[];
}

export const Places: React.FC<PlacesInterface> = ({
  campgrounds,
  handleCardClick,
  loadingCampgrounds,
  loadingTrailheads,
  onSearchTextChange,
  searchText,
  trailheads,
  tripType,
}) => {
  const placeholder =
    tripType === 'Camp' ? 'Search for campgrounds' : 'Search for trailheads';

  const renderCampgrounds = () => {
    if (loadingCampgrounds) {
      return (
        <Spinner
          thickness='2px'
          speed='0.65s'
          emptyColor='gray.200'
          color='green.700'
          size='lg'
        />
      );
    }
    return (
      Array.isArray(campgrounds) &&
      campgrounds.map((cg) => {
        return (
          <Place
            {...cg}
            key={cg.id}
            handleCardClick={handleCardClick}
            tripType={tripType}
          />
        );
      })
    );
  };

  const renderTrailheads = () => {
    if (loadingTrailheads) {
      return (
        <Spinner
          thickness='2px'
          speed='0.65s'
          emptyColor='gray.200'
          color='green.700'
          size='lg'
        />
      );
    }
    return (
      Array.isArray(trailheads) &&
      trailheads.map((th) => {
        return (
          <Place
            {...th}
            key={th.id}
            handleCardClick={handleCardClick}
            tripType={tripType}
          />
        );
      })
    );
  };

  return (
    <div>
      <Input
        bg='white'
        marginBottom={4}
        placeholder={placeholder}
        onChange={(e) => onSearchTextChange(e.target.value)}
        value={searchText}
        marginTop={1}
      />
      <List spacing={4}>
        {tripType === 'Camp' ? renderCampgrounds() : renderTrailheads()}
      </List>
    </div>
  );
};
