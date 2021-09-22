import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import { useSelectedPlaces } from '../contexts/SelectedPlacesContext';
import { StyledContainer } from './StyledContainer';

const today = new Date();
const sixMonths = new Date();
sixMonths.setMonth(sixMonths.getMonth() + 6);

export const MultiDaypicker = () => {
  const { selectedDates, setDates } = useSelectedPlaces();
  const handleClick: any = (day, { selected }) => {
    const selectedDays = [...selectedDates];
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    setDates(selectedDays);
  };

  return (
    <div id='recrebot-date-picker'>
      <StyledContainer backgroundColor='white' borderRadius={6} width='320px'>
        <DayPicker
          fromMonth={today}
          selectedDays={selectedDates}
          onDayClick={handleClick}
          disabledDays={{ before: today, after: sixMonths }}
        />
      </StyledContainer>
    </div>
  );
};
