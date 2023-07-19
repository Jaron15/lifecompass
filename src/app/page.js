'use client'
import Image from 'next/image'
import { getDocs, collection } from "firebase/firestore";
import {db} from '../utils/firebase';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {useSelector, useDispatch} from 'react-redux'

//hobbies testing
import { addHobby } from '../redux/hobbies/hobbiesSlice';
import { deleteHobby } from '../redux/hobbies/hobbiesSlice';
import { updateHobby } from '../redux/hobbies/hobbiesSlice';
import { logPractice } from '../redux/hobbies/hobbiesSlice';
//hobbies testing 



export default function Home() {
  const [items, setItems] = useState([]);
  const {signOutUser} = useAuth();
  const { user } = useSelector((state) => state.user);
console.log(user);

//hobbies testing
const newHobby = {
  id: Date.now().toString(),
  hobbyName: 'guitar',
  practiceTimeGoal: 60,
  daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
  practiceLog: []
};
const practiceLog = {date: '2023-08-01', timeSpent: '60'}
const [hobbyName, setHobbyName] = useState("");
  const dispatch = useDispatch();

  const hobbies = useSelector(state => state.hobbies.hobbies);

  const handleSubmit = async (event) => {
    console.log(hobbies);
    console.log('button clicked');
    if (user) {
      dispatch(addHobby({user: user, hobby: newHobby}))
      }
  }
  const deleteHobbyClick = async(user, hobbyFirestoreId) => {
    console.log('-------------right here --------------',hobbyFirestoreId);
dispatch(deleteHobby({user: user, hobbyId: hobbyFirestoreId}))
  }
  const updateHobbyNameClick = (user, hobby) => {
    console.log('button clicked');
    const updatedHobby = {...hobby, hobbyName: 'Drums'};
    dispatch(updateHobby({user: user, hobby: updatedHobby}));
  }
  const updateHobbyGoalClick = (user, hobby) => {
    console.log('button clicked');
    const updatedHobby = {...hobby, practiceTimeGoal: '30'};
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
    
    // Assume logEntry is an object like { date: '2023-08-01', timeSpent: 120 }
    dispatch(logPractice({user: user, hobbyId: hobbyId, logEntry: logEntry}));
  }

  useEffect(() => {
    console.log(hobbies);

}, [hobbies]); 


//hobbies testing

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "testItems"));
      const data = querySnapshot.docs.map(doc => doc.data());
      setItems(data);
    };

    fetchData();
  }, []);

  if (items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <p>{item.name}</p>
          <h1>Welcome to Home!</h1>
          {user ? (
        <h2>Welcome back, {user.displayName}!</h2>
      ) : (
        <h2>You're not logged in.</h2>
      )}
        </div>
      ))}
      <h1 className='cursor-pointer text-blue-500' onClick={signOutUser}>Logout</h1>
     {user ? <div>
      <button onClick={handleSubmit}>
RIGHT HERE
      </button>
      
      <ul>
        {hobbies && hobbies.map(hobby => (
          <div className='flex justify-center flex-col' key={hobby.id}>
          <li className='cursor-pointer font-bold text-center text-lg underline' onClick={() => deleteHobbyClick(user, hobby.firestoreId)} key={hobby.id}>{hobby.hobbyName}</li>
          <div className=' flex flex-row justify-center'>
            {hobby.daysOfWeek.map((day, index) => (
              <p className='mx-2' key={index}>{day}</p>
            ))}
          </div>
          <div className='flex flex-row justify-center' onClick={() => logPracticeClick(user, hobby.firestoreId, practiceLog)}>
            {hobby.practiceTimeGoal} Minutes
          </div>
          <div className='flex flex-row justify-between'>
          <button className='bg-sky-400 rounded w-1/4' onClick={() => updateHobbyNameClick(user, hobby)}>Update Name</button>
          <button className='bg-sky-400 rounded w-1/4' onClick={() => updateHobbyGoalClick(user, hobby)}>Update Goal</button>
          <button className='bg-sky-400 rounded w-1/4' onClick={() => updateHobbyDaysClick(user, hobby)}>Update Days</button>
          </div>
          </div>
        ))}
      </ul>
    </div> :'' }
    </div>
  );
}
