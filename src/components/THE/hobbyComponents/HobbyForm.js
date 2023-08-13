import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHobby } from '../../../redux/hobbies/hobbiesSlice';

const HobbyForm = ({closeAddForm}) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [hobbyFormData, setHobbyFormData] = useState({
      name: '',
      practiceDuration: 10,
      practiceDays: [],
      practiceLog: []
    })
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
        practiceDuration: Number(e.target.value)
      }));
    };
    
    const handleDayChange = (day) => {
      setHobbyFormData(prevState => {
        if (prevState.practiceDays.includes(day)) {
          return {
            ...prevState,
            practiceDays: prevState.practiceDays.filter(d => d !== day)
          };
        } else {
          return {
            ...prevState,
            practiceDays: [...prevState.practiceDays, day]
          };
        }
      });
    };
    const isSubmitEnabled = hobbyFormData.name.trim() !== "" && hobbyFormData.practiceDays.length > 0;
  
    const hobbySubmit = async (event) => {
      event.preventDefault();
      const hobbyData = {
          name: hobbyFormData.name,
          practiceTimeGoal: hobbyFormData.practiceDuration,
          daysOfWeek: hobbyFormData.practiceDays,
          practiceLog: hobbyFormData.practiceLog
      };
      try {
        console.log(hobbyData);
          await dispatch(addHobby({user: user, hobby: hobbyData}));
    
          console.log("Hobby added successfully!");
    
          setHobbyFormData({
              name: '',
              practiceDuration: 10,
              practiceDays: [],
              practiceLog: []
          });
          closeAddForm();
      } catch (error) {
          console.error("Error adding hobby:", error);
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
                  checked={hobbyFormData.practiceDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white font-bold mb-2" htmlFor="practiceDuration">How long for a session:</label>
          <select 
            id="practiceDuration"
            value={hobbyFormData.practiceDuration}
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
        <button 
          onClick={hobbySubmit}
          className={`block w-full max-w-xs mx-auto bg-primary hover:bg-highlight dark:bg-highlight dark:hover:primary focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold disabled:opacity-25 ${!isSubmitEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit
        </button>
      </div>
    );
  }

  export default HobbyForm;