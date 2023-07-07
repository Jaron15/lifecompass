'use client'
import Image from 'next/image'
import { getDocs, collection } from "firebase/firestore";
import {db} from '../utils/firebase';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {useSelector} from 'react-redux'



export default function Home() {
  const [items, setItems] = useState([]);
  const {signOutUser} = useAuth();
  const { user } = useSelector((state) => state.user);
console.log(user);


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
    </div>
  );
}
