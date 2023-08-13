'use client'
import React, { useState } from 'react';
import HobbyForm from './hobbyComponents/HobbyForm';
import EventForm from './eventComponents/EventForm';
import TaskForm from './taskComponents/TaskForm';
import {ImCancelCircle} from 'react-icons/Im';

const AddForm = ({closeAddForm}) => {
  const [selectedItem, setSelectedItem] = useState('');
  
  const handleChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 ">
      <form 
      className="bg-white dark:bg-boxdark shadow-lg p-8 flex flex-col w-5/6 max-w-sm mx-auto rounded-lg relative border dark:border-primary">
        <button 
            onClick={closeAddForm}
            className="absolute top-2 right-2 rounded-full px-2 focus:outline-none text-black dark:text-current"
        >
           <ImCancelCircle size={24} />
        </button>
       {!selectedItem && <label className="mb-2 text-black dark:text-[#e9e9e8]" >
          What would you like to add to your calendar?
        </label> }
        <select 
          value={selectedItem} 
          onChange={handleChange} 
          className="border p-2 rounded-lg my-4 text-black"
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