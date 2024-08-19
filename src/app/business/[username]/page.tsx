import React, { useState } from 'react';
import { Calendar } from '@nextui-org/react'; // Ensure correct import

interface DailyHoursProps {
  selectedDate: Date;
}

const DailyHours: React.FC<DailyHoursProps> = ({ selectedDate }) => {
  const [hours, setHours] = useState(0);

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHours(parseInt(event.target.value, 10));
  };

  return (
    <div className="daily-hours">
      <h2>Daily Hours for {selectedDate.toDateString()}</h2>
      <input
        type="number"
        value={hours}
        onChange={handleHoursChange}
        min="0"
        max="24"
        step="0.5"
      />
      <p>You have worked {hours} hours on this day.</p>
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (event: React.SyntheticEvent<HTMLDivElement, Event>) => {
    // Assuming the selected date is available in the event object
    const date = new Date(); // Replace this with actual date extraction from the event
    setSelectedDate(date);
  };

  return (
    <div className="calendar-page">
      <h1>Your Calendar</h1>
      <Calendar onSelect={handleDateSelect} />

      {selectedDate ? (
        <DailyHours selectedDate={selectedDate} />
      ) : (
        <p>Please select a date to view or add hours.</p>
      )}
    </div>
  );
};

export default CalendarPage;
