'use client'
import PlaceholderPage from '@/src/components/PlaceholderPage'
import React, { useState } from 'react'
import Notebook from '../../components/THE/hobbyComponents/notebook/Notebook'
import { useDispatch, useSelector } from 'react-redux';

import OverviewTab from './OverviewTab';

function Page() {
  const hobbies = useSelector(state => state.hobbies.hobbies);
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Overview');

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
const hobby = hobbies[currentHobbyIndex]
console.log(hobbies[currentHobbyIndex]);
const renderTabContent = () => {
  switch (selectedTab) {
    case "Overview":
      return <div>Overview Content</div>;
    case "Goals":
      return <div>Goals Content</div>;
    case "Progress":
      return <div>Progress Content</div>;
    case "Notes":
      return <div>Notes Content</div>;
    default:
      return <div>Overview Content</div>;
  }
};

  return (
   
    <div className="mx-auto w-screen-2xl bg-gradient-to-t from-slate-100 via-whiten to-white dark:bg-black dark:from-transparent dark:to-transparent dark:via-transparent p-4 md:p-6 2xl:p-10 h-full text-black dark:text-current">
    {/* Header */} 
  <header className="flex justify-center items-center p-4 text-white ">
      <span onClick={handlePreviousHobby} className="text-4xl cursor-pointer text-black dark:text-current">&#8592;</span> {/* Left Arrow */}
      <h1 className="text-center sm:text-5xl text-3xl font-bold text-black dark:text-current mx-20">
        {hobby.name}
      </h1>
      <span onClick={handleNextHobby} className="text-4xl cursor-pointer text-black dark:text-current">&#8594;</span> {/* Right Arrow */}
    </header>
    <div className="flex justify-center mb-8 border-b my-4 ">
        {["Overview", "Goals", "Progress", "Notes"].map((tabName) => (
          <span
            key={tabName}
            className={`cursor-pointer px-4 py-2 mr-2 ${selectedTab === tabName ? "border-b-2 border-blue-600" : ""}`}
            onClick={() => setSelectedTab(tabName)}
          >
            {tabName}
          </span>
        ))}
      </div>

   <OverviewTab hobby={hobby}/>

    {/* Footer */}
    <footer className=" p-4 text-white">
      {/* This is where the footer content, like quick links, will go */}
    </footer>
  </div>
  );
}

export default Page;