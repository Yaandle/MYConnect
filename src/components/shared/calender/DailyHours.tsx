import React from 'react';
import { DateValue } from '@internationalized/date';

interface DailyHoursProps {
  selectedDate: DateValue | null;
}

const DailyHours: React.FC<DailyHoursProps> = ({ selectedDate }) => {
  if (!selectedDate) {
    return <div className="text-center p-4 bg-gray-100 rounded-lg">Select a date to view daily schedule</div>;
  }

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'am' : 'pm';
    return `${hour}:00 ${ampm}`;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Daily Schedule for {selectedDate.toString()}</h2>
      <div className="grid grid-cols-[auto,1fr] gap-2">
        {hours.map((hour, index) => (
          <React.Fragment key={index}>
            <div className="text-right pr-2">{hour}</div>
            <input type="text" className="border border-gray-300 rounded px-2 py-1 w-full" />
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Priorities</h3>
          <textarea className="border border-gray-300 rounded px-2 py-1 w-full h-32" />
        </div>
        <div>
          <h3 className="font-bold mb-2">To Do List</h3>
          <textarea className="border border-gray-300 rounded px-2 py-1 w-full h-32" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold mb-2">Notes</h3>
        <textarea className="border border-gray-300 rounded px-2 py-1 w-full h-24" />
      </div>
    </div>
  );
};

export default DailyHours;