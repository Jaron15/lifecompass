import React from 'react';

function HobbyDetails({hobby}) {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const weekend = ["Sat", "Sun"];
    const practiceDays = hobby.daysOfWeek.map(day => day.substring(0, 3)); 
  
    return (
      <div className="flex flex-col  items-center space-y-4 p-4 w-full  h-full">
        <div className='w-full flex flex-col justify-center items-center space-y-4 p-4 '>
            <div className='underline'>Practice Days</div>
        <div className="flex space-x-3 md:space-x-4">
          {weekdays.map((day) => (
            <div key={day} className={`border-2 ${practiceDays.includes(day) ? 'border-cyan-600 shadow-glow shadow-cyan-600' : 'border-zinc-300 dark:border-zinc-400'} bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center`}>
              <span className="text-sm font-semibold">{day}</span>
            </div>
          ))}
        </div>
        <div className="flex space-x-3 md:space-x-4">
          {weekend.map((day) => (
            <div key={day} className={`border-2 ${practiceDays.includes(day) ? 'border-cyan-600' : 'border-zinc-300 dark:border-zinc-400'} bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center`}>
              <span className="text-sm font-semibold">{day}</span>
            </div>
          ))}
        </div>
        </div>
      </div>
    );
  }

export default HobbyDetails;




