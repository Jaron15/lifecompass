import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addCompletedTask, deleteCompletedTask, markTaskAsCompleted, updateTask } from '../redux/tasks/tasksSlice';

function TaskItem({item, date, isRecurringTaskCompletedForDate, isSingularTaskCompletedForDate}) {
    const completedTasks = useSelector((state) => state.tasks.completedTasks);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)
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
  )
}

export default TaskItem