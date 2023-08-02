'use client'

import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../redux/tasks/tasksSlice';

function TaskForm() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const userId = user.uid
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    // console.log(form.taskName.value);
    const task = {
      name: form.taskName.value,
      type: form.taskType.value,
      recurringDay: form.recurringDay.value,
      dueDate: form.dueDate.value,
    };
    dispatch(addTask({userId: userId, task: task}));
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  <div className="flex flex-col">
    <label className="text-sm font-semibold" htmlFor="taskName">
      Task Name:
    </label>
    <input className="border border-gray-400 rounded p-2" id="taskName" name="taskName" required />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-semibold" htmlFor="taskType">
      Task Type:
    </label>
    <select className="border border-gray-400 rounded p-2" id="taskType" name="taskType" required>
      <option value="">Select a type...</option>
      <option value="singular">Singular</option>
      <option value="recurring">Recurring</option>
    </select>
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-semibold" htmlFor="recurringDay">
      Recurring Day (only for recurring tasks):
    </label>
    <input className="border border-gray-400 rounded p-2" id="recurringDay" name="recurringDay" />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-semibold" htmlFor="dueDate">
      Due Date (only for singular tasks):
    </label>
    <input className="border border-gray-400 rounded p-2" id="dueDate" name="dueDate" type="date" />
  </div>

  <button className="bg-blue-500 text-white rounded py-2 px-4" type="submit">Add Task</button>
</form>

  );
}

export default TaskForm;
