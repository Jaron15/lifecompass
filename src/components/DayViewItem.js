import React, {  useState } from "react";
import { useSelector } from 'react-redux';
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; 
import EventItem from "./EventItem";
import HobbyItem from "./HobbyItem";
import TaskItem from "./TaskItem";

function DayViewItem({ item,
  index,
  isEditModalOpen,
  handleDeleteClick,
  handleEditClick,
  date,}) {
    const completedTasks = useSelector((state) => state.tasks.completedTasks);
    const tasks = useSelector((state) => state.tasks.tasks);
  const [expandedItem, setExpandedItem] = useState(null); 
  const toggleDetails = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };
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
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for an accurate comparison
    return eventDate < today;
};

const isRecurringTaskCompletedForDate  = completedTasks && completedTasks.some(ctask => ctask.refId === item.refId && (ctask.dueDate === date && ctask.completedDate ));
      const isSingularTaskCompletedForDate = tasks && tasks.some(task => task.refId === item.refId && task.isCompleted && task.dueDate === date);
      const hasPracticeLog = item.practiceLog && item.practiceLog.some(log => log.date === date);
      const eventHasPassed = isDateInPast(item.date) 
  return (
    <div key={index} className="mb-4 relative">
 {expandedItem === index &&  !isEditModalOpen && (
          <>
          <FaTrash className="absolute top-6 right-5 cursor-pointer text-black dark:!text-white z-30" onClick={() => handleDeleteClick(item)} />
          <FaPencilAlt className="absolute top-6 text-black left-5 cursor-pointer dark:!text-white z-30" onClick={() => handleEditClick(item)} />
          </>
        )} 
    <div
      className={`p-4 rounded-lg dark:bg-black  shadow drop-shadow   ${getClassNameForCategory(
        item.category
      )} ${isRecurringTaskCompletedForDate || isSingularTaskCompletedForDate || hasPracticeLog || eventHasPassed ? '!text-slate-600 dark:!text-slate-600 !border-slate-500 !shadow-slate-500' : ''}`}
    >
      <span 
      onClick={() => toggleDetails(index)}
      className={`text-black dark:text-white text-center font-bold block text-xl ${isRecurringTaskCompletedForDate || isSingularTaskCompletedForDate ? 'text-slate-600 dark:text-slate-300' : ''}`}>{item.name}</span>
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
     date={date} />
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

export default DayViewItem