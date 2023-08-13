import React, { useEffect, useState } from "react";
import LogPracticeForm from "./LogPracticeForm";
import { useDispatch, useSelector } from 'react-redux';
import { addCompletedTask, deleteCompletedTask, deleteTask, markTaskAsCompleted, updateTask } from '../../redux/tasks/tasksSlice';
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; 
import {ImCancelCircle} from 'react-icons/Im';
import DeleteModal from './DeleteModal';  
import { deleteEvent } from "@/src/redux/events/eventsSlice";
import { deleteHobby } from "@/src/redux/hobbies/hobbiesSlice";

const DayViewModal = ({ isOpen, onClose, items, date }) => {
  const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)
    const completedTasks = useSelector((state) => state.tasks.completedTasks);
    const tasks = useSelector((state) => state.tasks.tasks);
  const [expandedItem, setExpandedItem] = useState(null); 
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  const confirmDelete = (item) => {
    
    console.log(itemToDelete);
    switch(itemToDelete.category) {
    case 'Task':
      console.log('entered task case');
      console.log(itemToDelete);
      dispatch(deleteTask({userId:user.uid, taskId:itemToDelete.refId}))
      break;
    case 'Event':
      console.log('entered task case');
      console.log(itemToDelete);
      dispatch(deleteEvent({userId:user.uid, eventId:itemToDelete.refId}))
      break;
    case 'Hobby':
      console.log('entered task case');
      console.log(itemToDelete);
      dispatch(deleteHobby({user:user, hobbyId:itemToDelete.refId}))
      break;
      default:
       
        break;
    }
    console.log('Deleting:', itemToDelete);

   
    setShowDeleteModal(false);
    setItemToDelete(null);
  }

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }



  if (!isOpen) return null;


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

  const toggleDetails = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  

  const handleCompletion = (task, date) => {
    console.log(task);
    if (task.type === 'recurring'){
    dispatch(addCompletedTask({userId: user.uid, task:task, dueDate:date})); 
   } else {
   dispatch(markTaskAsCompleted({userId: user.uid, taskId:task.refId})) 
  }
};

const handleUndo = (task, date) => {
  if (task.type === 'recurring') {
  const completedTaskForUndo = completedTasks.find(ctask => ctask.refId === task.refId && ctask.dueDate === date);
  const taskId = completedTaskForUndo.docId
  dispatch(deleteCompletedTask({userId: user.uid, taskId: taskId }))
}
else {
  dispatch(updateTask({
    userId: user.uid,
    taskId: task.id,
    updatedTask: {
      ...task,
      isCompleted: false
    }
  }));
const completedTask = completedTasks.find(ctask => ctask.refId === task.id && ctask.dueDate === date);
  if (completedTask) {
     dispatch(deleteCompletedTask({userId: user.uid, taskId: completedTask.id}));
  }
}

};

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 w-full lg:w-768px mx-auto">
       <DeleteModal 
        isOpen={showDeleteModal} 
        type={itemToDelete?.category.toLowerCase()} 
        item={itemToDelete}
        onDelete={confirmDelete}
        onCancel={cancelDelete}
      />
  <div className="relative bg-white w-5/6 h-5/6 sm:w-3/5 sm:h-4/6 md:w-4/6 md:h-4/6 lg:w-1/2 2xl:w-2/5 lg:ml-72 lg:mt-14 mt-12 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar">
    <div className="w-full flex mb-12">
        <div 
           onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
            className="absolute top-5 right-6 cursor-pointer cursor-pointer text-black dark:text-current"
            title="Close"
        >
            <ImCancelCircle size={24} />
        </div>
        </div>
        {items.map((item, index) => {
      const isRecurringTaskCompletedForDate  = completedTasks && completedTasks.some(ctask => ctask.refId === item.refId && (ctask.dueDate === date || ctask.completedDate === date));
      const isSingularTaskCompletedForDate = tasks && tasks.some(task => task.refId === item.refId && task.isCompleted && task.dueDate === date);
      const hasPracticeLog = item.practiceLog && item.practiceLog.some(log => log.date === date);

          return (

  <div key={index} className="mb-4 relative">
 {expandedItem === index && (
          <>
          <FaTrash className="absolute top-6 right-5 cursor-pointer dark:!text-white z-40" onClick={() => handleDeleteClick(item)} />
<FaPencilAlt style={{ color: 'red !important' }} className="absolute top-6 left-5 cursor-pointer dark:!text-white z-40" onClick={() => handleEdit(item)} />

          </>
        )}
    <div
      className={`p-4 rounded-lg dark:bg-black  shadow drop-shadow   ${getClassNameForCategory(
        item.category
      )} ${isRecurringTaskCompletedForDate || isSingularTaskCompletedForDate || hasPracticeLog ? '!text-slate-600 dark:!text-slate-600 !border-slate-500 !shadow-slate-500' : ''}`}
    >
      <span 
      onClick={() => toggleDetails(index)}
      className={`text-black dark:text-white text-center font-bold block text-xl ${isRecurringTaskCompletedForDate || isSingularTaskCompletedForDate ? 'text-slate-600 dark:text-slate-300' : ''}`}>{item.name}</span>
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
        <LogPracticeForm hobbyId={item.refId} date={date} />
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
                checked={item.type === 'recurring' ? isRecurringTaskCompletedForDate : isSingularTaskCompletedForDate}
                readOnly
              />
            </li>
            {(item.type === 'recurring' && isRecurringTaskCompletedForDate) || (item.type !== 'recurring' && isSingularTaskCompletedForDate) ? (
            <button className="border border-yellow-600 rounded p-2 mt-2 hover:shadow hover:shadow-yellow-600" onClick={() => handleUndo(item, date)}>Undo Completion</button>
          ) : (
            <button className="border border-yellow-600 rounded p-2 mt-2 hover:shadow hover:shadow-yellow-600" onClick={() => handleCompletion(item, date)}>Mark as Complete</button>
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
