import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';


function Upcoming() {
  const { events, tasks, hobbies } = useSelector(state => ({
    events: state.events.events,
    tasks: state.tasks.tasks,
    hobbies: state.hobbies.hobbies
  }));
const [testState, setTestState] = useState(false)
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  // Calculate the start and end dates for the upcoming week
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);
  endOfWeek.setHours(0, 0, 0, 0); 

  const eventsForWeek = events.filter(event => new Date(event.date) > today && new Date(event.date) <= endOfWeek);
  const tasksForWeek = tasks.filter(task => 
    (task.dueDate && new Date(task.dueDate) > today && new Date(task.dueDate) <= endOfWeek) || 
    (task.recurringDay)
  );
  const todayIndex = today.getDay();

  const getClosestDateForRecurring = (recurringDay) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const recurringIndex = daysOfWeek.indexOf(recurringDay);

    let dayDifference = recurringIndex - todayIndex;
    if (dayDifference <= 0) {
        dayDifference += 7; 
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + dayDifference);
    return nextDate.toISOString().split('T')[0];
  };

  const combinedItems = [...eventsForWeek, ...tasksForWeek].sort((a, b) => {
    const dateA = a.date || a.dueDate || getClosestDateForRecurring(a.recurringDay);
    const dateB = b.date || b.dueDate || getClosestDateForRecurring(b.recurringDay);
    return new Date(dateA) - new Date(dateB);
  });

  function formatDateForDisplay(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
    const shortDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `${weekday} (${shortDate})`;
  }

  const hobbyMessageTemplates = [
    (hobbyName, sessionsLeft) => `Keep it up with ${hobbyName}! ${sessionsLeft} more ${sessionsLeft === 1 ? 'practice' : 'practices'} for this week.`,
    (hobbyName, sessionsLeft) => `Stay consistent with ${hobbyName}. Only ${sessionsLeft} ${sessionsLeft === 1 ? 'practice' : 'practices'} left this week!`,
    (hobbyName, sessionsLeft) => `You're doing great with ${hobbyName}. ${sessionsLeft} ${sessionsLeft === 1 ? 'session' : 'sessions'} to go for the week.`,
    (hobbyName, sessionsLeft) => `${hobbyName} awaits! ${sessionsLeft} more ${sessionsLeft === 1 ? 'time' : 'times'} this week.`,
  ];
  

  const hobbyPracticeMessages = hobbies.map(hobby => {
    const sessionsThisWeek = hobby.daysOfWeek.length;
    const pastSessions = hobby.daysOfWeek.filter(day => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
      return dayIndex < todayIndex;
    }).length;
    const sessionsLeft = sessionsThisWeek - pastSessions;

    // Randomly select a message template and generate the message
    const randomTemplate = hobbyMessageTemplates[Math.floor(Math.random() * hobbyMessageTemplates.length)];
    return randomTemplate(hobby.name, sessionsLeft);
  });

  return (
    <div className="mx-auto text-black dark:text-current max-w-xl h-full overflow-clip">
  <h2 className="text-2xl font-bold mb-4 text-center">Whats Coming Up </h2>
<div className='overflow-scroll pb-12 h-full hide-scrollbar'>
  <ul className="list-disc pl-6 space-y-1 sm:space-y-2 sm:text-center sm:list-none sm:pl-0 xl:text-left xl:list-disc xl:pl-6">
    {combinedItems.map(item => {
      if (item.date) {
        return (
            //event        
          <li key={item.id} className="text-base cursor-pointer font-bold transition-colors hover:text-blue-400 dark:text-shadow-dk text-shadow-lt shadow-blue-400 dark:hover:shadow-white hover:shadow-black dark:hover:font-bold hover:font-medium hover:text-shadow-hlt dark:hover:text-shadow-hdk">
            {item.name} on {formatDateForDisplay(item.date)}
          </li>
        );
      } else {
        const recurringDate = item.recurringDay ? getClosestDateForRecurring(item.recurringDay) : null;
        return (
          <li key={item.id} className="text-base font-bold cursor-pointer transition-colors hover:text-yellow-600 dark:text-shadow-dk text-shadow-lt shadow-yellow-600 dark:hover:shadow-white hover:shadow-black dark:hover:font-bold hover:font-medium hover:text-shadow-hlt dark:hover:text-shadow-hdk">
            {item.name} due on {recurringDate ? formatDateForDisplay(recurringDate) : formatDateForDisplay(item.dueDate)}
          </li>
        );
      }
    })}

    {hobbyPracticeMessages.map((message, index) => (
      <li key={index} className="text-base font-bold cursor-pointer transition-colors hover:text-green-600 dark:text-shadow-dk text-shadow-lt shadow-green-600 dark:hover:shadow-white hover:shadow-black dark:hover:font-bold hover:font-medium hover:text-shadow-hlt dark:hover:text-shadow-hdk">{message}</li>
    ))}
  </ul>
  </div>
</div>
  );
}

export default Upcoming;
