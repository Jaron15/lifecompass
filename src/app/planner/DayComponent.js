'use client'
import React from 'react';
import DayViewModal from '../../components/THE/DayViewModal';
import { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';


const DayComponent = ({ day, isWeekend, isDifferentMonth, events = [], hobbies = [], tasks = [], currentMonth, currentYear, formattedMonth, fillerDay}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const formattedDay = String(day).padStart(2, '0');
  const date = `${currentYear}-${formattedMonth}-${formattedDay}`;
  const completedTasks = useSelector((state) => state.tasks.completedTasks);
    // const tasks = useSelector((state) => state.tasks.tasks);

  const handleClose = () => {
    
    setModalOpen(false)
  }
  const handleOpen = () => {
    if (!fillerDay) {
    setModalOpen(true)
  }
  }
  const isDateInPast = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for an accurate comparison
    return eventDate < today;
};

  const completedClass = '!line-through !bg-slate-500  !border-slate-500 dark:!border-slate-500 !shadow-slate-500 !dark:shadow-slate-500 !text-slate-400 dark:!text-slate-900 dark:!bg-slate-500';

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
    onClick={handleOpen}>
      <span className={spanClassNames}>{day}</span>
      {events && events.length > 0 && events.map((event, i) => (
        <div key={i} className={`dark:bg-blue-800 text-black dark:text-white border-blue-400 border shadow dark:shadow-none dark:border-none shadow-blue-400 px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap sm:text-base text-[0.5rem] ${isDateInPast(event.date) ? completedClass : ''}`}>
          {event.name}
        </div>
      ))}
      {hobbies && hobbies.length > 0 && hobbies.map((hobby, i) => {
        const hasPracticeLog = hobby.practiceLog && hobby.practiceLog.some(log => log.date === date);

        return (
        <div key={i} className={`dark:bg-green-800 text-black dark:text-white border border-green-600 shadow shadow-green-600 dark:shadow-none dark:border-none px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap  sm:text-base text-[0.5rem] ${hasPracticeLog ? 'bg-slate-500 dark:bg-slate-500 border-slate-500 dark:border-slate-500 shadow-slate-500 dark:shadow-slate-500 text-slate-400 dark:!text-slate-900 line-through' : ''}`}>
          {hobby.name}
        </div>
      )})}
      {tasks && tasks.length > 0 && tasks.map((task, i) => { 
            const isRecurringTaskCompleted = completedTasks && completedTasks.some(ctask => ctask.refId === task.refId && (ctask.dueDate === date && ctask.completedDate ));
            const isSingularTaskCompleted = task.isCompleted && task.dueDate === date;
            const isCompleted = isRecurringTaskCompleted || isSingularTaskCompleted;

        return(
  <div key={i} className={`dark:bg-yellow-800 text-black dark:text-white border dark:border-none dark:shadow-none border-yellow-600 shadow shadow-yellow-600 px-0.5 sm:py-0.5 py-[1px] rounded sm:mt-1 overflow-clip whitespace-nowrap sm:text-base text-[0.5rem] ${isCompleted ? completedClass : ''}`}>
    {task.name}
  </div>
)})}
<DayViewModal 
  isOpen={isModalOpen} 
  onClose={handleClose} 
  items={[ ...(events || []), ...(hobbies || []), ...(tasks || [])]}
  date={date}
  
/>
    </td>
    );
  };

  export default DayComponent