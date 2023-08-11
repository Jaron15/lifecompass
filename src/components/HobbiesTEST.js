'use client'
//hobbies testing
import { addHobby, deletePracticeLog, updatePracticeLog } from '../redux/hobbies/hobbiesSlice';
import { deleteHobby } from '../redux/hobbies/hobbiesSlice';
import { updateHobby } from '../redux/hobbies/hobbiesSlice';
import { logPractice } from '../redux/hobbies/hobbiesSlice';

import { useSelector, useDispatch } from 'react-redux';
import {useState, useEffect} from 'react'
import Modal from '../components/Modal'
import { clearError } from '../redux/hobbies/hobbiesSlice';
//hobbies testing 

//hobbies testing
 const HobbiesTEST = () => {

const { error } = useSelector((state) => state.hobbies); 
const state = useSelector((state) => state);
console.log(state);
const { user } = useSelector((state) => state.user);

const [modalMessage, setModalMessage] = useState(null);
const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const handleClose = () => {
    closeModal();
    dispatch(clearError());
  };

const newHobby = {
  name: 'guitar',
  practiceTimeGoal: 60,
  daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
  practiceLog: []
};
const practiceLog = {date: '2023-08-01', timeSpent: 60}
const newLogEntry = {
  date: '2023-07-19',
  timeSpent: 90
}
const [name, setname] = useState("");
  const dispatch = useDispatch();

  const hobbies = useSelector(state => state.hobbies.hobbies);

  const handleSubmit = async (event) => {
    console.log(hobbies);
    console.log('button clicked');
    if (user) {
      dispatch(addHobby({user: user, hobby: newHobby}))
      }
  }
  const dummyHobbyId = "thisHobbyDoesntExist";

  const deleteHobbyClick = async(user, hobbyFirestoreId) => {
dispatch(deleteHobby({user: user, hobbyId: hobbyFirestoreId}))
  }
  const updatenameClick = (user, hobby) => {
    console.log('button clicked');
    const updatedHobby = {...hobby, name: 'Drums'};
    dispatch(updateHobby({user: user, hobby: updatedHobby}));
  }
  const updateHobbyGoalClick = (user, hobby) => {
    console.log('button clicked');
    const updatedHobby = {...hobby, practiceTimeGoal: 30};
    dispatch(updateHobby({user: user, hobby: updatedHobby}));
  }
  const updateHobbyDaysClick = (user, hobby) => {
    console.log('button clicked');
    const newDay = 'Sunday';
    if (!hobby.daysOfWeek.includes(newDay)) {
      const updatedHobby = {...hobby, daysOfWeek: hobby.daysOfWeek.concat(newDay)};
      dispatch(updateHobby({user: user, hobby: updatedHobby}));
    } else {
      console.log(`${newDay} is already in the days of week`);
    };
  }

  const logPracticeClick = (user, hobbyId, logEntry) => {
    console.log('Log practice button clicked');
    dispatch(logPractice({user: user, hobbyId: hobbyId, logEntry: logEntry}));
  }
  const deletePracticeLogClick = (user, hobbyId, logEntryId) => {
    console.log('delete log function clicked');
    dispatch(deletePracticeLog({user: user, hobbyId: hobbyId, logEntryId: logEntryId}));
  }
  
  const updatePracticeLogClick = (user, hobbyId, logEntryId, newLogEntry) => {
    dispatch(updatePracticeLog({user: user, hobbyId: hobbyId, logEntryId: logEntryId, newLogEntry: newLogEntry}));
  }
  

  useEffect(() => {
    console.log(isModalOpen);
    if (error) {
      console.log(error);
      setModalMessage(error);
      openModal();
    }
}, [hobbies, error, isModalOpen]); 


//hobbies testing

return (
    
    <div>
        <div>
      {/* ... */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleClose}
          title="Error"
          message={modalMessage}
        />
      )}
      {/* ... */}
    </div>
      <button onClick={handleSubmit}>
RIGHT HERE
      </button>
      
      {/* hobbies testing */}
      <ul>
        {hobbies && hobbies.map(hobby => (
          <div className='flex justify-center flex-col' key={hobby.id}>
          <li className='cursor-pointer font-bold text-center text-lg underline' onClick={() => deleteHobbyClick(user, hobby.firestoreId)} key={hobby.id}>{hobby.name}</li>
          <div className=' flex flex-row justify-center'>
            {hobby.daysOfWeek.map((day, index) => (
              <p className='mx-2' key={index}>{day}</p>
            ))}
          </div>
          <div className='flex flex-row justify-center' onClick={() => logPracticeClick(user, hobby.firestoreId, practiceLog)}>
            {hobby.practiceTimeGoal} Minutes
          </div>
          <div className='flex flex-row justify-center' >{hobby.practiceLog.map((log, index) => (
            <div key={log.id}>
            <p className='mx-2 cursor-pointer'  onClick={() => deletePracticeLogClick(user, hobby.firestoreId, log.id)} >{log.date}/{log.timeSpent}</p>
            <button 
      className='bg-primary rounded w-1/2' 
      onClick={() => updatePracticeLogClick(user, hobby.firestoreId, log.id, { ...log, timeSpent: 90 })}
    >
      Update Log Entry
    </button>
  </div>
          ))}
          </div>
          <div className='flex flex-row justify-between'>
          <button className='bg-sky-400 rounded w-1/4' onClick={() => updatenameClick(user, hobby)}>Update Name</button>
          <button className='bg-sky-400 rounded w-1/4' onClick={() => updateHobbyGoalClick(user, hobby)}>Update Goal</button>
          <button className='bg-sky-400 rounded w-1/4' onClick={() => updateHobbyDaysClick(user, hobby)}>Update Days</button>
        
          </div>
          </div>
        ))}
      </ul>
       {/* hobbies testing */}
    </div>
)
          }

          export default HobbiesTEST