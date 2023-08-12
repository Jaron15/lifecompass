import React, { useEffect, useState } from "react";
import LogPracticeForm from "./LogPracticeForm";
import { useDispatch, useSelector } from 'react-redux';
import { addCompletedTask, deleteCompletedTask } from '../../redux/tasks/tasksSlice';

const DayViewModal = ({ isOpen, onClose, items, date }) => {
  const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)
    const completedTasks = useSelector((state) => state.tasks.completedTasks);
  const [expandedItem, setExpandedItem] = useState(null); 
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  
 console.log(isCheckboxSelected);
  if (!isOpen) return null;

  function getClassNameForCategory(category) {
    switch (category) {
      case "Event":
        return "border border-blue-400 shadow-blue-400";
      case "Hobby":
        return "border border-green-600 shadow-green-600";
      case "Task":
        return "border border-yellow-600 shadow-yellow-600";
      default:
        return "border border-gray-200";
    }
  }

  const toggleDetails = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  

  const handleCompletion = (task, date) => {
    

    dispatch(addCompletedTask({userId: user.uid, task:task, dueDate:date}));
    
};
const handleUndo = (task, date) => {
  const completedTaskForUndo = completedTasks.find(ctask => ctask.refId === task.refId && ctask.dueDate === date);
  const taskId = completedTaskForUndo.docId
  dispatch(deleteCompletedTask({userId: user.uid, taskId: taskId }))
};

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 w-full lg:w-768px mx-auto">
  <div className="bg-white w-5/6 h-5/6 sm:w-3/5 sm:h-4/6 md:w-4/6 md:h-4/6 lg:w-1/2 2xl:w-2/5 lg:ml-72 lg:mt-14 mt-12 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="mb-4 bg-red-500 text-black dark:text-white"
        >
          Close
        </button>
        {items.map((item, index) => {
      const isTaskCompletedForDate = completedTasks && completedTasks.some(ctask => ctask.refId === item.refId && (ctask.dueDate === date || ctask.completedDate === date));
          return (
  <div key={index} className="mb-4 ">
    <div
      className={`p-4 rounded-lg dark:bg-black  shadow drop-shadow   ${getClassNameForCategory(
        item.category
      )}`}
    >
      <span 
      onClick={() => toggleDetails(index)}
      className="text-black dark:text-white text-center font-bold block text-xl ">{item.name}</span>
              {expandedItem === index && (
  <div className=" bg-gray-100 p-4 rounded-md ">
    {/* EVENT */}
    {item.category === "Event" && (
     <div className="flex flex-wrap bg-gray-100 px-auto text-left  sm:text-center rounded-md text-black dark:text-white">
     <ul className="w-full sm:w-1/2">
       <li className="my-2"><strong>Time:</strong> <br/> {item.time || 'Not Specified'}</li>
       <li className="my-2"><strong>Repeats:</strong> <br/> {item.isRepeating === "" ? "No" : item.isRepeating}</li>
     </ul>
     <ul className="w-full sm:w-1/2">
       <li className="my-2"><strong>Description:</strong> <br/> {item.details.description || '(Not Specified)'}</li>
       <li className="my-2"><strong>Location:</strong> <br/>  {item.details.location || '(Not Specified)'}</li>
       <li className="my-2"><strong>URL:</strong> <br/> {item.details.url || '(Not Specified)'}</li>
       {item.endDate && <li><strong>End Date:</strong> {item.endDate}</li>}
     </ul>
   </div>
    )}
    {/* HOBBY */}
    {item.category === "Hobby" && (
       
      <ul className="sm:text-center text-left text-black dark:text-white">
        <li className="my-2"><strong>Practice Days:</strong> <br/> {item.daysOfWeek.join(", ")}</li>
        <li className="my-2"><strong>Practice Time Goal:</strong> <br/> {item.practiceTimeGoal + ' Minutes'}</li>
        <LogPracticeForm hobbyId={item.firestoreId} date={date} />
      </ul>
  
    )}
    {/* TASK */}
    {item.category === "Task" && (
      <ul className="sm:text-center text-left text-black dark:text-white">
        <li className="my-2"><strong>Type:</strong> <br/> {item.type === 'recurring' ? "Recurring" : "Singular"}</li>
        {item.type === 'recurring' ? (
          <li className="my-2"><strong>Recurring Day:</strong> <br/> {item.recurringDay}</li>
        ) : (
          <li className="my-2"><strong>Due Date:</strong> <br/> {item.dueDate}</li>
        )}
        <li className="my-2">
        <strong>Completed:</strong>
              <input 
                type="checkbox" 
                checked={isTaskCompletedForDate}
                readOnly
              />
            </li>
            {isTaskCompletedForDate ? (
              <button onClick={() => handleUndo(item, date)}>Undo Completion</button>
            ) : (
              <button onClick={() => handleCompletion(item, date)}>Mark as Complete</button>
            )}
          </ul>
    )}
  </div>
)}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default DayViewModal;
