import React from 'react';

function Calendar() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] ;
  const dates = Array.from({ length: 30 }, (_, i) => i + 1); // for a 30 day month

  return (
    <div className="flex flex-col items-center sm:p-4 ">
      <h2 className="text-xl text-black font-bold mb-4">May 2023</h2>
      <div className="grid grid-cols-7 text-black w-full">
        {days.map((day, index) => (
          <div key={index} className="text-center font-bold">
            {day}
          </div>
        ))}
        {dates.map((date, index) => (
          <div key={index} className="text-center w-full h-28 mx-auto border rounded p-2">
            {date}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
