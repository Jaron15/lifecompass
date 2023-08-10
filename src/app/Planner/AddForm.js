'use client'
import React, { useState } from 'react';
import HobbyForm from './HobbyForm';
import EventForm from './EventForm';
import TaskForm from './TaskForm';

const AddForm = ({closeAddForm}) => {
  const [selectedItem, setSelectedItem] = useState('');
  
  const handleChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 ">
      <form 
      className="bg-white shadow-lg p-8 flex flex-col w-5/6 max-w-sm mx-auto rounded-lg relative">
        <button 
            onClick={closeAddForm}
            className="absolute top-2 right-2 border rounded-full px-2 hover:bg-red-600 focus:outline-none"
        >
            x
        </button>
       {!selectedItem && <label className="mb-2">
          What would you like to add to your calendar?
        </label> }
        <select 
          value={selectedItem} 
          onChange={handleChange} 
          className="border p-2 rounded-lg my-4"
        >
          {!selectedItem && <option value="">Select...</option>}
          <option value="Hobby">Hobby</option>
          <option value="Event">Event</option>
          <option value="Task">Task</option>
        </select>
        {selectedItem === "Hobby" && <HobbyForm closeAddForm={closeAddForm} />}
        {selectedItem === "Event" && <EventForm closeAddForm={closeAddForm}  />}
        {selectedItem === "Task" && <TaskForm closeAddForm={closeAddForm} />}
      </form>
    </div>
  );
}

export default AddForm;