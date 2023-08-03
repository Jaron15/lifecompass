'use client'

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchTasks, 
  getCompletedTasks, 
  completeTask, 
  addCompletedTask,
  deleteTask,
  markTaskAsCompleted, 
  deleteCompletedTask,
  updateTask,
  updateCompletedTask
} from '../redux/tasks/tasksSlice';

function TaskList() {
  const dispatch = useDispatch();
  
  const tasks = useSelector((state) => state.tasks.tasks);
  const completedTasks = useSelector((state) => state.tasks.completedTasks);
  const { user } = useSelector((state) => state.user);
  const userId = user.uid

  // useEffect(() => {
    
  //   dispatch(getCompletedTasks(userId));
  // }, [dispatch, user]);

  return (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-semibold text-blue-600">Tasks</h2>
      {tasks && tasks.map((task) => (
        <div key={task.id} className="border p-4 mt-4 bg-gray-100 rounded-lg">
          <p className="font-medium text-lg">{task.name}</p>
  
          <input 
            className="mt-2 p-2 border rounded-lg mx-4"
            defaultValue={task.name}
            id={`update-name-${task.id}`}
          />
  
          <button
            onClick={() => {
              const updatedName = document.getElementById(`update-name-${task.id}`).value;
              if (updatedName !== task.name) {
                dispatch(updateTask({
                  userId: userId, 
                  taskId: task.id, 
                  updatedTask: { name: updatedName }
                }));
              }
            }}
            className="mt-2 p-2 bg-yellow-500 text-white rounded-lg"
          >
            Update task name
          </button>
            
          <button
          onClick={() => dispatch(updateTask({
            userId: userId, 
            taskId: task.id, 
            updatedTask: { type: task.type === 'recurring' ? 'singular' : 'recurring' }
          }))}
          className="mt-2 p-2 bg-green-500 text-white rounded-lg mx-4"
        >
          Switch Type
        </button>

          {task.type === 'recurring' && (
            <button
              onClick={() => dispatch(addCompletedTask({userId: userId, task: task}))}
              className="mt-2 p-2 bg-blue-500 text-white rounded-lg mx-4"
            >
              Complete task
            </button>
          )}

          {task.type === 'singular' && (
            <button
              onClick={() => {
                const currentDate = new Date();
                const dateString = currentDate.toISOString().split('T')[0];
                dispatch(markTaskAsCompleted({userId: userId, taskId: task.id, completedDate: dateString}))
              }}
              className="mt-2 p-2 bg-blue-500 text-white rounded-lg mx-4"
            >
              Complete task
            </button>
          )}
  
          <button
            onClick={() => dispatch(deleteTask({userId:userId, taskId: task.id}))}
            className="mt-2 p-2 bg-red-500 text-white rounded-lg"
          >
            Delete task
          </button>
        </div>
      ))}
  
      <h2 className="text-2xl font-semibold text-blue-600 mt-6">Completed Tasks</h2>

      {completedTasks && completedTasks.map((task) => (
    <div key={task.id} className="border p-4 mt-4 bg-gray-100 rounded-lg">
      <p className="font-medium text-lg">{task.name}</p>
      <p>Completed on: {task.completedDate}</p>
      <button 
        onClick={() => dispatch(deleteCompletedTask({userId: userId, taskId: task.id}))}
        className="mt-2 p-2 bg-red-500 text-white rounded-lg mx-4"
      >
        Delete task
      </button>
      <button
        onClick={() => {
          const currentCompletedDate = new Date(task.completedDate);
          currentCompletedDate.setDate(currentCompletedDate.getDate() + 1);
          const newCompletedDate = currentCompletedDate.toISOString().split('T')[0];
          dispatch(updateCompletedTask({ userId: userId, taskId: task.id, updatedFields: { completedDate: newCompletedDate } }))
        }}
        className="mt-2 p-2 bg-green-500 text-white rounded-lg"
      >
        change completed date
      </button>
    </div>
  ))}
    </div>
  );
}

export default TaskList;


