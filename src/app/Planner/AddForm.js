'use client'
import React, { useState } from 'react';

const AddForm = () => {
  const [selectedItem, setSelectedItem] = useState('');

  const handleChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <div className="absolute  inset-0 flex items-center justify-center z-20 ">
      <form 
      className="bg-white shadow-lg p-8 flex flex-col w-5/6 max-w-sm mx-auto rounded-lg ">
        <label className="mb-2">
          What would you like to add to your calendar?
        </label>
        <select 
          value={selectedItem} 
          onChange={handleChange} 
          className="border p-2 rounded-lg mb-4"
        >
          <option value="">Select...</option>
          <option value="Hobby">Hobby</option>
          <option value="Event">Event</option>
          <option value="Task">Task</option>
        </select>
      </form>
    </div>
  );
}

export default AddForm;