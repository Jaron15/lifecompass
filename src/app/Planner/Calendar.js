'use client'
import React, { useState, Fragment, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from "react-swipeable";





const Calendar = () => {
  const [direction, setDirection] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [prevDate, setPrevDate] = useState();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // month is zero-based index

  // Calculate the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Calculate the day of the week the month starts on
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };
  const DayComponent = ({ day, isWeekend, isDifferentMonth }) => {
    let tdClassNames = "ease relative h-30 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31";
    let spanClassNames = "font-medium text-black dark:text-white";
  
    if (isWeekend) tdClassNames += " bg-gray-200";
    if (isDifferentMonth) tdClassNames += " text-gray-500";
    if (isToday(day)) spanClassNames += "  bg-primary rounded-full text-white p-2 m-[-0.5rem]";
  
    return (
      <td className={tdClassNames}>
        <span className={spanClassNames}>{day}</span>
      </td>
    );
  };
  
  
  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
    setDirection(1);
  };
  
  const prevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
    setDirection(-1);
  };
  

  const renderDayHeaders = () =>
  daysOfWeek.map((day, index) => (
    <th
      key={index}
      className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5 sticky top-0 z-99999" 
    >
      <span className="hidden lg:block">{day}</span>
      <span className="block lg:hidden">{day.substring(0, 3)}</span>
    </th>
  ));


  const renderDaysOfMonth = () => {
    let days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<DayComponent key={`prev${i}`} day="" isWeekend={false} isDifferentMonth={true} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(<DayComponent key={day} day={day} isWeekend={[0,6].includes((firstDayOfMonth + day - 1) % 7)} isDifferentMonth={false} />);
    }  
    return days;
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => nextMonth(),
    onSwipedRight: () => prevMonth(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });
  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      
      };
    }
  };
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, []);

  
  return (
    <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-[calc(100vh - 56px)] overflow-hidden" {...handlers} >
    <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between items-center px-6 py-4 hidden lg:flex">
        <button onClick={prevMonth}>{"<"}</button>
        <h2>{`${monthNames[currentMonth]}, ${currentYear}`}</h2>
        <button onClick={nextMonth}>{">"}</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white sticky">{renderDayHeaders()}</tr>
        </thead>
        <tbody>
        <Fragment key={direction}>
    <AnimatePresence mode='wait' >
          <motion.tr 
          key={currentMonth}
          custom={direction}
          variants={variants}
          initial={isFirstRender ? false : "enter"}
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
className="grid grid-cols-7">{renderDaysOfMonth()}</motion.tr>
    </AnimatePresence>
    </Fragment>
        </tbody>
      </table>
    </div>
    </div>
    
  );
};

export default Calendar;
