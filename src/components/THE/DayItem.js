import React, {  useState } from "react";
import { useSelector } from 'react-redux';
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; 
import EventItem from "./eventComponents/EventItem";
import HobbyItem from "./hobbyComponents/HobbyItem";
import TaskItem from "./taskComponents/TaskItem";

function DayItem({ item,
  index,
  isEditModalOpen,
  handleDeleteClick,
  handleEditClick,
  date,
  fromHomepage,
  expandedItem,
  toggleDetails})
   {
  console.log(fromHomepage);
    const completedTasks = useSelector((state) => state.tasks.completedTasks);
    const tasks = useSelector((state) => state.tasks.tasks);
  // const [expandedItem, setExpandedItem] = useState(null); 
  // const toggleDetails = (index) => {
  //   if (expandedItem === index) {
  //     setExpandedItem(null);
  //   } else {
  //     setExpandedItem(index);
  //   }
  // };
  function getClassNameForCategory(category) {
    switch (category) {
      case "Event":
        return "border border-blue-400 shadow-blue-400";
      case "Hobby":
        return "border border-green-800 shadow-green-600";
      case "Task":
        return "border border-yellow-600 shadow-yellow-600";
      default:
        return "border border-gray-200";
    }
  }
  const isDateInPast = (dateStr) => {
    if (item.category === 'Event') {
    const [year, month, day] = dateStr.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for an accurate comparison
    return eventDate < today;
  }
};
    const isRecurringTaskCompletedForDate  = completedTasks && completedTasks.some(ctask => ctask.refId === item.refId && (ctask.dueDate === date && ctask.completedDate ));

      const isSingularTaskCompletedForDate = tasks && tasks.some(task => task.refId === item.refId && task.isCompleted && task.dueDate === date);

      const hasPracticeLog = item.practiceLog && item.practiceLog.some(log => log.date === date);
      const eventHasPassed = isDateInPast(item.date) 
      function formatItemName(item) {
        if (item.category === 'Hobby') {
            return `Practice ${item.name} for ${item.practiceTimeGoal} min`;
        } else if (item.category === 'Event') {
            if (item.time) {
                // Convert military time to standard time with AM/PM
                const [hour, minute] = item.time.split(':').map(Number);
                const period = hour >= 12 ? 'PM' : 'AM';
                const standardHour = hour % 12 || 12;
                return `${item.name} at ${standardHour}:${minute.toString().padStart(2, '0')} ${period}`;
            } else if (item.location) {
                return `${item.name} at ${item.location}`;
            }
        } else if (item.category === 'Task') {
            return `To do: ${item.name}`;
        }
        return item.name;
    }
    const formattedName = formatItemName(item);
  return (
    <div key={index} className={`mb-4 relative ${fromHomepage && 'flex justify-center   w-full'}`}>
    <div
      className={`p-4 rounded-lg dark:bg-black  shadow drop-shadow ${fromHomepage && 'sm:w-9/12 lg:w-10/12 w-full'}  ${getClassNameForCategory(
        item.category
      )} ${isRecurringTaskCompletedForDate || isSingularTaskCompletedForDate || hasPracticeLog || eventHasPassed ? '!text-slate-600 dark:!text-slate-600 !border-slate-500 !shadow-slate-500' : ''}`}
    >
      <div className="relative">
 {expandedItem === index &&  !isEditModalOpen && (
          <>
          <FaTrash className="absolute top-2 right-3 cursor-pointer text-black dark:!text-white z-30" onClick={() => handleDeleteClick(item)} />
          <FaPencilAlt className="absolute top-2 text-black left-3 cursor-pointer dark:!text-white z-30" onClick={() => handleEditClick(item)} />
          </>
        )} 
        </div>
<div className="flex justify-center">
      <span 
      onClick={() => toggleDetails(index)}
      className={`text-black dark:text-white cursor-pointer text-center font-bold block 2xsm:max-w-44 md:max-w-full text-xl ${isRecurringTaskCompletedForDate || isSingularTaskCompletedForDate ? 'text-slate-600 dark:text-slate-300' : ''}`}>{formattedName}</span>
</div>
              {expandedItem === index && (
  <div className=" bg-gray-100 p-4 rounded-md ">
    {/* EVENT */}
    {item.category === "Event" && 
    <EventItem 
    item={item}
    />}
    {/* HOBBY */}
    {item.category === "Hobby" && (
     <HobbyItem 
     item={item} 
     date={date}
 />
    )}
    {/* TASK */}
    {item.category === "Task" && (
     <TaskItem 
     item={item}
     date={date}
     isRecurringTaskCompletedForDate={isRecurringTaskCompletedForDate}
     isSingularTaskCompletedForDate={isSingularTaskCompletedForDate}
     />
    )}
  </div>
)}
            </div>
          </div>
  );
}

export default DayItem