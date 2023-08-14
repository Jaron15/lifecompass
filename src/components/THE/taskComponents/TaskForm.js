import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../../redux/tasks/tasksSlice';

const TaskForm = ({ closeAddForm }) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [taskFormData, setTaskFormData] = useState({
        name: '',
        dueDate: '',
        type: 'singular',
        recurringDay: 'Sunday'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isSubmitEnabled = taskFormData.name.trim() !== "";

    const taskSubmit = async (event) => {
        event.preventDefault();
        const taskData = {
            ...taskFormData
        };
        if (taskData.type === 'singular') {
            taskData.recurringDay = '';
        }
        try {
            dispatch(addTask({ userId: user.uid, task: taskData }));
            console.log("Task added successfully!");
            setTaskFormData({
                name: '',
                dueDate: '',
                type: 'singular',
                recurringDay: ''
            });
            closeAddForm();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <div className="bg-gray-100 p-4 rounded-md max-h-[32rem]  w-full">
            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="name">Task Name:</label>
                <input 
                    type="text" 
                    id="name"
                    name="name" 
                    placeholder='Laundry'
                    value={taskFormData.name} 
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

          
        <div className="mb-4">
            <label className="block text-black dark:text-white font-bold mb-2" htmlFor="type">Type:</label>
            <select 
                id="type"
                value={taskFormData.type}
                onChange={handleChange}
                name="type"
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-black"
            >
                <option value="singular">Singular</option>
                <option value="recurring">Recurring</option>
            </select>
        </div>

        {taskFormData.type === "singular" && (
            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="dueDate">Due Date:</label>
                <input 
                    type="date" 
                    id="dueDate"
                    name="dueDate"
                    value={taskFormData.dueDate}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        )}

        {taskFormData.type === "recurring" && (
            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="recurringDay">Recurring Day:</label>
                <select 
                    id="recurringDay"
                    value={taskFormData.recurringDay}
                    onChange={handleChange}
                    name="recurringDay"
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-black"
                >
                    {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>
            </div>
        )}

            <button 
                onClick={taskSubmit}
                className={`block w-full max-w-xs mx-auto bg-primary hover:bg-highlight dark:bg-highlight dark:hover:primary focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold disabled:opacity-25 ${!isSubmitEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Submit
            </button>
        </div>
    );
}

export default TaskForm;
