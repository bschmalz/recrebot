import { Center, Input, List, Spinner } from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useMain } from '../contexts/MainContext';
import { useMainFinal } from '../contexts/MainFinalContext';
import { useSearchLocations } from '../contexts/SearchLocationsContext';
import { useTripType } from '../contexts/TripTypeContext';
import { Place } from './Place';

export const Places = () => {
  const {
    campgroundData,
    campgrounds,
    errorCampgrounds,
    errorTrailheads,
    loadingCampgrounds,
    loadingTrailheads,
    trailheadData,
    trailheads,
  } = useSearchLocations();

  const { searchText, setSearchText, searchTextRef } = useMain();
  const { handleSearch } = useMainFinal();

  const { tripType } = useTripType();

  const [smallText] = useMediaQuery('(max-width: 800px)');

  const [startedNewSearch, setStartedNewSearch] = useState(false);

  useEffect(() => {
    if (startedNewSearch) setStartedNewSearch(false);
  }, [campgroundData, trailheadData]);

  const placeholder =
    tripType === 'Camp' ? 'Search for campgrounds' : 'Search for trailheads';

  const onSearchTextChange = (searchText) => {
    setSearchText(searchText);
    handleSearch(searchText, tripType);
    searchTextRef.current = searchText;
    setStartedNewSearch(true);
  };

  const renderBody = () => {
    if (loadingCampgrounds || loadingTrailheads) {
      return (
        <Spinner
          thickness='2px'
          speed='0.65s'
          emptyColor='gray.200'
          color='green.700'
          size='lg'
        />
      );
    } else if (errorCampgrounds || errorTrailheads) {
      return (
        <Center>
          <Text>{`There was an error loading ${
            tripType === 'Camp' ? 'campgrounds.' : 'trailheads.'
          }`}</Text>
        </Center>
      );
    } else {
      return tripType === 'Camp' ? renderCampgrounds() : renderTrailheads();
    }
  };

  const renderNoResults = () => {
    return (
      <Center>
        <Text fontSize={smallText ? 10 : 12}>
          {searchText.length < 3
            ? 'Type in at least 3 chars or filter on map for search results.'
            : startedNewSearch
            ? ''
            : 'There are no results for that search.'}
        </Text>
      </Center>
    );
  };

  const renderCampgrounds = () => {
    if (campgroundData?.searchCampgrounds?.campgrounds?.length === 0) {
      return renderNoResults();
    }
    return (
      Array.isArray(campgrounds) &&
      campgrounds.map((cg) => {
        return <Place {...cg} key={cg.id} />;
      })
    );
  };

  const renderTrailheads = () => {
    if (trailheadData?.searchTrailheads?.trailheads?.length === 0) {
      return renderNoResults();
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
      <List spacing={4}>{renderBody()}</List>
    </div>
  );
};
