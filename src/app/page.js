'use client'
import {db} from '../utils/firebase';
import { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import TaskForm from "../components/TaskFormTEST";
import HobbiesTEST from '../components/HobbiesTEST'
import TaskList from "../components/tasksTEST";
import EventsTestComponent from "../components/EventsTEST";
import DayViewModal from "../components/THE/DayViewModal";
import Upcoming from '../components/Upcoming';

export default function Home() {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);
  const {user} = useSelector((state) => state.user)
  const {hobbies} = useSelector(state => state.hobbies);
  const {events} = useSelector(state => state.events);
  const {tasks} = useSelector(state => state.tasks)
  console.log(user);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth(); 
const formattedMonth = String(currentMonth + 1).padStart(2, '0');
const currentDay = currentDate.getDate();
const formattedDay = String(currentDay).padStart(2, '0');
const currentDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
const currentDayName = daysOfWeek[currentDate.getDay()];


  const getEventsForDay = (events, dateStr) => {
    return events.filter(event => event.date === dateStr);
};
const getHobbiesForDay = (hobbies, dayName) => {
  return hobbies.filter(hobby => hobby.daysOfWeek.includes(dayName));
};
const getTasksForDay = (tasks, dayName, dateStr) => {
  return tasks.filter(task => {
      return (task.recurringDay && task.recurringDay.includes(dayName)) || 
             (task.dueDate && task.dueDate === dateStr);
  });
};
const currentEvents = getEventsForDay(events, currentDateStr).map(event => ({...event, category: "Event"}));
const currentHobbies = getHobbiesForDay(hobbies, currentDayName).map(hobby => ({...hobby, category: "Hobby"}));
const currentTasks = getTasksForDay(tasks, currentDayName, currentDateStr).map(task => ({...task, category: "Task"}));

useEffect(() => {
}, [currentDate])
  

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
        return "Good morning";
    } else if (currentHour < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}

  return (
    <div className="mx-auto w-screen-2xl dark:bg-black bg-whiten p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <header className=" p-4 text-white ">
        <h1 className="text-center sm:text-4xl text-3xl font-bold text-black dark:text-current ">{formattedDate}</h1>
        { user ? <p className="text-center text-xl mt-2 text-black dark:text-current ">{getGreeting()}, {user.displayName}!</p> : <p className="text-center text-xl mt-2 text-black dark:text-current ">{getGreeting()}, Guest!</p>}
      </header>
    <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
      {/* Day at a Glance */}
        <DayViewModal 
        items={[ ...(currentEvents  || []), ...(currentHobbies  || []), ...(currentTasks || [])]}
        isOpen={true}
        date={currentDateStr}
        fromHomepage={true}
/>

      {/* Upcoming */}
      <section className="col-span-12  rounded shadow shadow-2xl border border-stroke bg-white p-7.5 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
        <Upcoming /> 
      </section>
      </div>

      {/* Progress Overview */}
      <section className="p-4">
        {/* This is where the Progress Overview content will go */}
      </section>

      {/* Footer */}
      <footer className="bg-secondary p-4 text-white">
        {/* This is where the footer content, like quick links, will go */}
      </footer>
    </div>
  );

}
