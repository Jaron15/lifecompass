'use client'
import React from 'react';
import DayViewModal from './DayViewModal';
import { useState, useEffect} from 'react';


const DayComponent = ({ day, isWeekend, isDifferentMonth, events = [], hobbies = [], tasks = [], currentMonth, currentYear, formattedMonth}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const formattedDay = String(day).padStart(2, '0');
  const date = `${currentYear}-${formattedMonth}-${formattedDay}`;

  const handleClose = () => {
    console.log('handleClose');
    setModalOpen(false)
  }

    let tdClassNames = "ease relative  cursor-pointer border border-stroke sm:p-1 p-[5px] transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:p-3 xl:h-31 overflow-clip text-center sm:text-start";
    let spanClassNames = "font-medium text-black dark:text-white ";

    
    // find out if today is the current date 
  const isToday = (day) => {
      const today = new Date();
      return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };
  
    if (isWeekend) tdClassNames += " bg-gray-200";
    if (isDifferentMonth) tdClassNames += " text-gray-500";
    if (isToday(day)) spanClassNames += "  bg-primary rounded-full text-white px-1 sm:px-2 m-[-0.5rem]";
  
    return (
      <td 
    style={{
      height: `calc(100vh / 7.38) `,
    }}
    className={tdClassNames}
    onClick={() => setModalOpen(true)}>
      <span className={spanClassNames}>{day}</span>
      {hobbies && hobbies.length > 0 && hobbies.map((hobby, i) => (
        <div key={i} className="dark:bg-green-800 text-black dark:text-white border border-green-600 shadow shadow-green-600 dark:shadow-none dark:border-none px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap  sm:text-base text-[0.5rem]">
          {hobby.name}
        </div>
      ))}
      {events && events.length > 0 && events.map((event, i) => (
        <div key={i} className="dark:bg-blue-800 text-black dark:text-white border-blue-400 border shadow dark:shadow-none dark:border-none shadow-blue-400 px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap  sm:text-base text-[0.5rem]">
          {event.name}
        </div>
      ))}
      {tasks && tasks.length > 0 && tasks.map((task, i) => (
  <div key={i} className="dark:bg-yellow-800 text-black dark:text-white border dark:border-none dark:shadow-none border-yellow-600 shadow shadow-yellow-600 px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap  sm:text-base text-[0.5rem]">
    {task.name}
  </div>
))}
<DayViewModal 
  isOpen={isModalOpen} 
  onClose={handleClose} 
  items={[...(hobbies || []), ...(events || []), ...(tasks || [])]}
  date={date}
  
/>
    </td>
    );
  };

  export default DayComponent