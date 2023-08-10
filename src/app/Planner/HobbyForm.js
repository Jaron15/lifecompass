import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHobby } from '../../redux/hobbies/hobbiesSlice';

const HobbyForm = ({closeAddForm}) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [hobbyFormData, setHobbyFormData] = useState({
      hobbyName: '',
      practiceDuration: 10,
      practiceDays: [],
      practiceLog: []
    })
    const handleHobbyNameChange = (e) => {
      const { name, value } = e.target;
      setHobbyFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
    };
    
    const handlePracticeDurationChange = (e) => {
      setHobbyFormData(prevState => ({
        ...prevState,
        practiceDuration: e.target.value
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
    const isSubmitEnabled = hobbyFormData.hobbyName.trim() !== "" && hobbyFormData.practiceDays.length > 0;
  
    const hobbySubmit = async (event) => {
      event.preventDefault();
      const hobbyData = {
          hobbyName: hobbyFormData.hobbyName,
          practiceTimeGoal: hobbyFormData.practiceDuration,
          daysOfWeek: hobbyFormData.practiceDays,
          practiceLog: hobbyFormData.practiceLog
      };
      try {
        console.log(hobbyData);
          await dispatch(addHobby({user: user, hobby: hobbyData}));
    
          console.log("Hobby added successfully!");
    
          setHobbyFormData({
              hobbyName: '',
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
          <label className="block text-gray-700 font-bold mb-2" htmlFor="hobbyName">Hobby Name:</label>
          <input 
            type="text" 
            id="hobbyName"
            name="hobbyName" 
            value={hobbyFormData.hobbyName} 
            onChange={handleHobbyNameChange} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 font-bold mb-2">Days you want to practice:</span>
          <div>
            {daysOfWeek.map(day => (
              <label key={day} className="inline-block mr-4">
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
          <label className="block text-gray-700 font-bold mb-2" htmlFor="practiceDuration">How long for a session:</label>
          <select 
            id="practiceDuration"
            value={hobbyFormData.practiceDuration}
            onChange={handlePracticeDurationChange}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!isSubmitEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit
        </button>
      </div>
    );
  }

  export default HobbyForm;