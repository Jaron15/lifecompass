'use client'
import React from 'react';
import DayViewModal from './DayViewModal';
import { useState, useEffect} from 'react';


const DayComponent = ({ day, isWeekend, isDifferentMonth, events, hobbies, tasks, currentMonth, currentYear}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const handleClose = () => {
    console.log('handleClose');
    setModalOpen(false)
  }
  useEffect(() => {
    console.log("Modal state changed:", isModalOpen);
  }, [isModalOpen]);
  

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
        <div key={i} className="bg-green-800 text-white px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap  sm:text-base text-[0.5rem]">
          {hobby}
        </div>
      ))}
      {events && events.length > 0 && events.map((event, i) => (
        <div key={i} className="bg-blue-800 text-white px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap  sm:text-base text-[0.5rem]">
          {event}
        </div>
      ))}
      {tasks && tasks.length > 0 && tasks.map((task, i) => (
  <div key={i} className="bg-yellow-800 text-white px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap  sm:text-base text-[0.5rem]">
    {task}
  </div>
))}
<DayViewModal 
  isOpen={isModalOpen} 
  onClose={handleClose} 
  items={[...(hobbies || []), ...(events || [])]}  
/>
    </td>
    );
  };

  export default DayComponent