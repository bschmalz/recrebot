import * as React from 'react';
import { useSafeSetState } from '../hooks/safeSetState';

export interface SelectedPlaceInterface {
  type: string;
  name: string;
  parent_name: string;
  longitude: number;
  latitude: number;
  id: number;
  district?: string;
  description: string;
  sub_type: string;
  legacy_id: string;
  facility_id?: string;
  subparent_id?: string;
}

interface SelectedPlaceContextInterface {
  addSelectedPlace: ({}) => void;
  removeSelectedPlace: (id: number) => void;
  resetSelectedPlaces: () => void;
  selectCard: ({}) => void;
  selectedCard: SelectedPlaceInterface;
  selectedDates: Date[];
  selectedPlaces: SelectedPlaceInterface[];
  selectedPlacesObj: { [key: string]: SelectedPlaceInterface };
  setDates: (dates: Date[]) => void;
  setSelectedPlaces: ({}) => void;
}

const initialState: SelectedPlaceContextInterface = {
  addSelectedPlace: () => {},
  removeSelectedPlace: () => {},
  resetSelectedPlaces: () => {},
  selectCard: () => {},
  selectedCard: null,
  selectedDates: [],
  selectedPlaces: [],
  selectedPlacesObj: {},
  setSelectedPlaces: () => {},
  setDates: (dates) => {},
};

const SelectedPlaceContext = React.createContext(initialState);

function useSelectedPlaces() {
  const context = React.useContext(SelectedPlaceContext);
  if (!context) {
    throw new Error(`useSelectedPlace must be used within a CountProvider`);
  }
  return context;
}

function SelectedPlaceProvider(props) {
  const [
    { selectedCard, selectedDates, selectedPlaces, selectedPlacesObj },
    safeSetState,
  ] = useSafeSetState(initialState);

  const addSelectedPlace = (sp) => {
    const newSelectedPlacesObj = { ...selectedPlacesObj };
    if (newSelectedPlacesObj[sp.id]) return;
    newSelectedPlacesObj[sp.id] = sp;
    safeSetState({
      selectedCard: null,
      selectedPlaces: [...selectedPlaces, sp],
      selectedPlacesObj: newSelectedPlacesObj,
    });
  };

  const resetSelectedPlaces = () => {
    safeSetState(initialState);
  };

  const removeSelectedPlace = (id) => {
    const newSelectedPlaces = selectedPlaces.filter((sp) => sp.id !== id);
    const newSelectedPlacesObj = { ...selectedPlacesObj };
    delete newSelectedPlacesObj[id];
    safeSetState({
      selectedPlaces: newSelectedPlaces,
      selectedPlacesObj: newSelectedPlacesObj,
    });
  };

  const setSelectedPlaces = (sp) => {
    const newPlacesObj = {};
    sp.forEach((p) => {
      newPlacesObj[p.id] = p;
    });
    safeSetState({ selectedPlaces: sp, selectedPlacesObj: newPlacesObj });
  };

  const selectCard = (card) => {
    if (!card) {
      safeSetState({ selectedCard: null });
    } else if (!selectedPlaces.find((sp) => sp.id === card.id)) {
      safeSetState({ selectedCard: card });
    }
  };

  const setDates = (dates) => {
    safeSetState({ selectedDates: dates });
  };

  const value = {
    addSelectedPlace,
    removeSelectedPlace,
    resetSelectedPlaces,
    selectCard,
    selectedCard,
    selectedDates,
    selectedPlaces,
    selectedPlacesObj,
    setDates,
    setSelectedPlaces,
  };
  return <SelectedPlaceContext.Provider value={value} {...props} />;
}
export { SelectedPlaceProvider, useSelectedPlaces };
