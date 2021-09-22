import { Input, List, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useMain } from '../contexts/MainContext';
import { useMainFinal } from '../contexts/MainFinalContext';
import { useSearchLocations } from '../contexts/SearchLocationsContext';
import { useTripType } from '../contexts/TripTypeContext';
import { Place } from './Place';

export const Places = () => {
  const { campgrounds, loadingCampgrounds, loadingTrailheads, trailheads } =
    useSearchLocations();

  const { searchText, setSearchText, searchTextRef } = useMain();
  const { handleSearch } = useMainFinal();

  const { tripType } = useTripType();

  const placeholder =
    tripType === 'Camp' ? 'Search for campgrounds' : 'Search for trailheads';

  const onSearchTextChange = (searchText) => {
    setSearchText(searchText);
    handleSearch(searchText, tripType);
    searchTextRef.current = searchText;
  };

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
        return <Place {...cg} key={cg.id} />;
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
        return <Place {...th} key={th.id} />;
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
        data-cy='search-input'
      />
      <List spacing={4}>
        {tripType === 'Camp' ? renderCampgrounds() : renderTrailheads()}
      </List>
    </div>
  );
};
