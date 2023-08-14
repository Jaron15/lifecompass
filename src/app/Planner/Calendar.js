'use client'
import React, { useState, Fragment, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from "react-swipeable";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { addHobby, clearError } from '../../redux/hobbies/hobbiesSlice';
import {createEvent} from '../../redux/events/eventsSlice';
import {addTask} from '../../redux/tasks/tasksSlice';
import DayComponent from "./DayComponent";
import AddForm from "../../components/THE/AddForm";
import Modal from '../../components/Modal';


const Calendar = () => {
  const {hobbies} = useSelector(state => state.hobbies);
  const {events} = useSelector(state => state.events);
  const {tasks} = useSelector(state => state.tasks)
  // test area //
  const user = useSelector((state) => state.user);
  const dispatch =useDispatch()
  
//test area end //
 //error modal 
//  const { error } = useSelector((state) => state.hobbies);
 
//    const [modalMessage, setModalMessage] = useState(null);
//  const [isModalOpen, setModalOpen] = useState(false);
//    const openModal = () => setModalOpen(true);
//    const closeModal = () => setModalOpen(false);
//    const handleClose = () => {
//      closeModal();
//      dispatch(clearError());
//    };
//    useEffect(() => {
//      console.log(isModalOpen);
//      if (error) {
//        console.log(error);
//        setModalMessage(error);
//        openModal();
//      }
//  }, [hobbies, error, isModalOpen]); 
 
 //error modal
  const [direction, setDirection] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [prevDate, setPrevDate] = useState();
  const [showForm, setShowForm] = useState(false)

  // button opacity control for mobile scroll 
  //to be able to see dates covered by button
  const [buttonOpacity, setButtonOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const maxScrollTop = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const opacity = 1 - document.documentElement.scrollTop / maxScrollTop;
  
      setButtonOpacity(opacity < 0 ? 0 : opacity);
    };
  
    // Attach event listener
    window.addEventListener("scroll", handleScroll);
  
    // Cleanup function
    return () => {
      // Remove event listener
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); 
  // month is zero-based index
  const formattedMonth = String(currentMonth + 1).padStart(2, '0');


  // Calculate the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Calculate the day of the week the month starts on
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  //functions to change month 
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
      days.push(<DayComponent key={`prev${i}`} day="" isWeekend={false} isDifferentMonth={true} currentMonth={currentMonth} formattedMonth={formattedMonth} currentYear={currentYear}/>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      // Get the name of the current day of the week
      const currentDayName = daysOfWeek[(firstDayOfMonth + day - 1) % 7];

      //----------events------------------
      const dayEvents = [];
      const formattedDay = String(day).padStart(2, '0');
      // Calculate the date of the current day
      const currentDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`; 
      
      // Filter events that are scheduled for this day
      const scheduledEvents = events.filter(event => event.date === currentDateStr);
      
      // Add the scheduled events to the `events` array
      scheduledEvents.forEach(event => {
        dayEvents.push({
          ...event,
          category: "Event",
      });
      });
      //----------events------------------
  
      //---------------hobbies----------------
      // Create a list of all hobby practice events that should occur on this day
      // console.log(currentDayName);
      const hobbyEvents = [];
      hobbies.forEach(hobby => {
        if (hobby.daysOfWeek.includes(currentDayName)) {
          hobbyEvents.push({
            ...hobby,
          category: "Hobby"
          });
        }
      });
      
  
      //---------------hobbies----------------
      
      //--------------tasks-------------------
      const taskEvents = [];
      tasks.forEach(task => {
        if (task.recurringDay && task.recurringDay.includes(currentDayName)) {
          taskEvents.push({
            ...task,
            category: "Task"
          });
        }
        else if (task.dueDate && task.dueDate.includes(currentDateStr)) {
          taskEvents.push({
            ...task,
            category: "Task"
          });
        }
      });
      
      //--------------tasks-------------------
        
        days.push(<DayComponent key={day} day={day} isWeekend={[0,6].includes((firstDayOfMonth + day - 1) % 7)} isDifferentMonth={false} events={dayEvents} hobbies={hobbyEvents} tasks={taskEvents} currentMonth={currentMonth} formattedMonth={formattedMonth} currentYear={currentYear} />);
      }
    // fill the remaining days to make total 42
    for (let i = days.length; i < 42; i++) {
      days.push(<DayComponent key={`next${i}`} day="" isWeekend={false} isDifferentMonth={true} currentMonth={currentMonth} formattedMonth={formattedMonth} currentYear={currentYear} fillerDay={true} />);
    }
    return days;
};

  
  //for changing month on mobile
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
    <div className="relative w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-[calc(100vh - 56px)] overflow-hidden" {...handlers} > 
    {/* {isModalOpen && (
      // <Modal
      //   isOpen={isModalOpen}
      //   onClose={handleClose}
      //   title="Error"
      //   message={modalMessage}
      // />
    )} */}
      {showForm && <AddForm closeAddForm={() => setShowForm(false)}/>}
    <div className="w-full max-w-full  rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-black ">
      <div className="justify-between items-center px-6 py-4 text-black dark:text-current flex">
        <button onClick={prevMonth}>{"<"}</button>
        <h2>{`${monthNames[currentMonth]}, ${currentYear}`}</h2>
        <button onClick={nextMonth}>{">"}</button>
      </div>
      {/* calendar table start*/}
      <table className="w-full mb-10 sm:mb-0">
        {/* day headers */}
        <thead>
          <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white sticky">{renderDayHeaders()}</tr>
        </thead>
        {/* days  */}
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
className="grid grid-cols-7">{renderDaysOfMonth()}
</motion.tr>
    </AnimatePresence>
    </Fragment>
        </tbody>
      </table>
      {/* add to calendar button  */}
      <button 
        style={{opacity: buttonOpacity}}
        className="absolute sm:bottom-5 sm:right-10 lg:right-30 bottom-20 right-5 bg-primary p-2 rounded-full text-white shadow-lg" 
        onClick={() => setShowForm(true)} 
      >
        <IoIosAddCircleOutline size={60} />
      </button>
    </div>
    </div>
    
  );
};

export default Calendar;
