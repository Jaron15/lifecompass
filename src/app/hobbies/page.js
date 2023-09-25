'use client'
import PlaceholderPage from '@/src/components/PlaceholderPage'
import React, { useState } from 'react'
import Notebook from '../../components/THE/hobbyComponents/notebook/Notebook'
import { useDispatch, useSelector } from 'react-redux';

function page() {
  const hobbies = useSelector(state => state.hobbies.hobbies);
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);

  const handleNextHobby = () => {
    if (currentHobbyIndex < hobbies.length - 1) {
      setCurrentHobbyIndex(currentHobbyIndex + 1);
    }
  };

  const handlePreviousHobby = () => {
    if (currentHobbyIndex > 0) {
      setCurrentHobbyIndex(currentHobbyIndex - 1);
    }
  };

console.log(hobbies[currentHobbyIndex]);
  return (
    <div 
      className="w-full flex flex-col justify-center items-center relative border border-white"
      style={{
        height: `calc(100vh - 68px)`,
        '@media (min-width: 1024px)': {
          height: `calc(100vh - 0px)`,
        },
      }}
    >
          <div className="flex w-full justify-between px-20 py-2 absolute top-10 left-0">
      {currentHobbyIndex > 0 ? (
        <button onClick={handlePreviousHobby}>Previous</button>
      ) : (
        <div style={{ width: 'fit-content' }}></div>
      )}
      {currentHobbyIndex < hobbies.length - 1 ? (
        <button onClick={handleNextHobby}>Next</button>
      ) : (
        <div style={{ width: 'fit-content' }}></div>
      )}
    </div>
    <Notebook hobby={hobbies[currentHobbyIndex]} />
  </div>

  );
}

export default page;
