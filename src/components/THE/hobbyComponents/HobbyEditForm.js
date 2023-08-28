import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHobby } from '../../../redux/hobbies/hobbiesSlice';

const EditHobbyForm = ({ item, onClose }) => {
    const dispatch = useDispatch();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const { user } = useSelector((state) => state.user);
    const [hobbyFormData, setHobbyFormData] = useState({
      name: item.name,
      practiceTimeGoal: item.practiceTimeGoal,
      daysOfWeek: item.daysOfWeek,
      refId: item.refId,
      practiceLog: item.practiceLog || [],
      createdDate: item.createdDate
    });
    const handlenameChange = (e) => {
        const { name, value } = e.target;
        setHobbyFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
      };
      
      const handlePracticeDurationChange = (e) => {
        setHobbyFormData(prevState => ({
          ...prevState,
          practiceTimeGoal: Number(e.target.value)
        }));
      };
      
      const handleDayChange = (day) => {
        setHobbyFormData(prevState => {
          if (prevState.daysOfWeek.includes(day)) {
            return {
              ...prevState,
              daysOfWeek: prevState.daysOfWeek.filter(d => d !== day)
            };
          } else {
            return {
              ...prevState,
              daysOfWeek: [...prevState.daysOfWeek, day]
            };
          }
        });
      };
    
    const isSubmitEnabled = hobbyFormData.name.trim() !== "" && hobbyFormData.daysOfWeek.length > 0;
  
    const hobbySubmit = async (event) => {
      event.preventDefault();
      const updatedHobbyData = {
          ...hobbyFormData
        };
      try {
           dispatch(updateHobby({user: user, hobby: updatedHobbyData}));
          onClose();
      } catch (error) {
          console.error("Error updating hobby:", error);
      }
    };
    
    return (
      <div className="bg-gray-100 p-4 rounded-md">
        <div className="mb-4">
          <label className="block text-black dark:text-white font-bold mb-2" htmlFor="name">Hobby Name:</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={hobbyFormData.name} 
            onChange={handlenameChange} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <span className="block text-black dark:text-white font-bold mb-2">Days you want to practice:</span>
          <div>
            {daysOfWeek.map(day => (
              <label key={day} className="inline-block mr-4 text-black dark:text-white">
                <input 
                  type="checkbox" 
                  value={day} 
                  className="mr-2 leading-tight"
                  checked={hobbyFormData.daysOfWeek.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white font-bold mb-2" htmlFor="practiceTimeGoal">How long for a session:</label>
          <select 
            id="practiceTimeGoal"
            value={hobbyFormData.practiceTimeGoal}
            onChange={handlePracticeDurationChange}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-black"
          >
            {[...Array(10)].map((_, index) => (
              <option key={index} value={(index + 1) * 10}>
                {(index + 1) * 10} minutes
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-row  justify-center'>
            <button 
                onClick={hobbySubmit}
                className={`block w-1/2 max-w-xs mx-1 bg-primary hover:bg-highlight dark:bg-highlight dark:hover:primary focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold disabled:opacity-25 ${!isSubmitEnabled ? 'opacity-50 cursor-not-allowed opacity-50' : ''}`}
            >
                Update
            </button>
            <button 
                onClick={onClose}
                className={`block w-1/2 max-w-xs mx-1 bg-red-500 hover:bg-highlight dark:bg-red-500 dark:hover:primary focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold `}
            >
                Cancel
            </button>
            </div>
      </div>
    );
  }

  export default EditHobbyForm;