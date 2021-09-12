import { Input, List, Spinner } from '@chakra-ui/react';
import React from 'react';
import {
  Campground as CampgroundType,
  Trailhead as TrailheadType,
} from '../../generated/graphql';
import { Place, PlaceInterface } from './Place';

export interface PlacesInterface extends PlaceInterface {
  campgrounds: CampgroundType[];
  loadingCampgrounds: boolean;
  loadingTrailheads: boolean;
  onSearchTextChange: Function;
  searchText: string;
  trailheads: TrailheadType[];
}

export const Places: React.FC<PlacesInterface> = ({
  addSelectedPlace,
  campgrounds,
  handleCardClick,
  handleCardMouseEnter,
  handleCardMouseLeave,
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
            addSelectedPlace={addSelectedPlace}
            handleCardClick={handleCardClick}
            handleCardMouseEnter={handleCardMouseEnter}
            handleCardMouseLeave={handleCardMouseLeave}
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
            addSelectedPlace={addSelectedPlace}
            key={th.id}
            handleCardClick={handleCardClick}
            handleCardMouseEnter={handleCardMouseEnter}
            handleCardMouseLeave={handleCardMouseLeave}
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
