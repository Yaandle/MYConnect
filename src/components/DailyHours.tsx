// components/DailyHours.tsx
import React from 'react';
import { DateValue } from '@internationalized/date';

interface DailyHoursProps {
  selectedDate: DateValue | null;
}

const DailyHours: React.FC<DailyHoursProps> = ({ selectedDate }) => {
  if (!selectedDate) {
    return <div>Select a date to view daily hours</div>;
  }

  // You can customize this part to display actual hours or fetch from an API
  const hours = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
  ];

  return (
    <div>
      <h2>Hours for {selectedDate.toString()}</h2>
      <ul>
        {hours.map((hour, index) => (
          <li key={index}>{hour}</li>
        ))}
      </ul>
    </div>
  );
};

export default DailyHours;