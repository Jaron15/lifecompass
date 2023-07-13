'use client'
import Image from 'next/image'
import { getDocs, collection } from "firebase/firestore";
import {db} from '../utils/firebase';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {useSelector, useDispatch} from 'react-redux'

//hobbies testing
import { addHobby } from '../redux/hobbies/hobbiesSlice';
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
const [hobbyName, setHobbyName] = useState("");
  const dispatch = useDispatch();

  const hobbies = useSelector(state => state.hobbies.hobbies); // This selects the hobbies from your Redux store

  const handleSubmit = async (event) => {
    console.log(hobbies);
    console.log('button clicked');
    if (user) {
      dispatch(addHobby({user: user, hobby: newHobby}))
      }
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
          <li key={hobby.id}>{hobby.hobbyName}</li>
        ))}
      </ul>
    </div> :'' }
    </div>
  );
}
