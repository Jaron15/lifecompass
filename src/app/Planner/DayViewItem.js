// DayViewItem.js
function DayViewItem({ item, type, isRecurringTaskCompletedForDate, isSingularTaskCompletedForDate, hasPracticeLog}) {
  
  
  //delete
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  const confirmDelete = (item) => {
    switch(itemToDelete.category) {
    case 'Task':
      dispatch(deleteTask({userId:user.uid, taskId:itemToDelete.refId}))
      break;
    case 'Event':
      dispatch(deleteEvent({userId:user.uid, eventId:itemToDelete.refId}))
      break;
    case 'Hobby':
      dispatch(deleteHobby({user:user, hobbyId:itemToDelete.refId}))
      break;
      default:
       
        break;
    }

    setShowDeleteModal(false);
    setItemToDelete(null);
  }

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }
//delete
//edit
const handleEditClick = (item) => {
  setItemToEdit(item);
  setIsEditModalOpen(true);
};

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
       <li className="my-2"><strong>Time:</strong> <br/>  {item.time ? convertTo12HourFormat(item.time) : 'Not Specified'}</li>
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
  );
}
