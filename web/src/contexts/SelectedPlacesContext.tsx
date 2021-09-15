import * as React from 'react';
import { useSafeSetState } from '../hooks/safeSetState';
import { SelectedPlaceInterface } from '../views/Main';

interface SelectedPlaceContextInterface {
  addSelectedPlace: ({}) => void;
  removeSelectedPlace: (id: number) => void;
  resetSelectedPlaces: () => void;
  selectCard: ({}) => void;
  selectedCard: SelectedPlaceInterface;
  selectedPlaces: SelectedPlaceInterface[];
  selectedPlacesObj: { [key: string]: SelectedPlaceInterface };
}

const initialState: SelectedPlaceContextInterface = {
  addSelectedPlace: () => {},
  removeSelectedPlace: () => {},
  resetSelectedPlaces: () => {},
  selectCard: () => {},
  selectedCard: null,
  selectedPlaces: [],
  selectedPlacesObj: {},
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
  const [{ selectedCard, selectedPlaces, selectedPlacesObj }, safeSetState] =
    useSafeSetState(initialState);

  const addSelectedPlace = (sp) => {
    const newSelectedPlacesObj = { ...selectedPlacesObj };
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

  const selectCard = (card) => {
    if (!card) {
      safeSetState({ selectedCard: null });
    } else {
      safeSetState({ selectedCard: card });
    }
  };

  const value = {
    addSelectedPlace,
    removeSelectedPlace,
    resetSelectedPlaces,
    selectCard,
    selectedCard,
    selectedPlaces,
    selectedPlacesObj,
  };
  return <SelectedPlaceContext.Provider value={value} {...props} />;
}
export { SelectedPlaceProvider, useSelectedPlaces };
