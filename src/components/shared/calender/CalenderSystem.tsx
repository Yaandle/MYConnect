import React, { useState } from "react";
import { Calendar } from "@nextui-org/calendar";
import { CalendarDate, DateValue } from '@internationalized/date';
import DailyHours from './DailyHours';

export default function CalendarSystem() {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex gap-x-4">
      <Calendar 
        aria-label="Date Selection" 
        onChange={handleDateChange}
      />
      <DailyHours selectedDate={selectedDate} />
    </div>
  );
}