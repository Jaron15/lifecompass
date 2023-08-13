'use client'
import { getDocs, collection } from "firebase/firestore";
import {db} from '../utils/firebase';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {useSelector, useDispatch} from 'react-redux'
import TaskForm from "../components/TaskFormTEST";

import HobbiesTEST from '../components/HobbiesTEST'
import TaskList from "../components/tasksTEST";
import EventsTestComponent from "../components/EventsTEST";




export default function Home() {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);
  const {user} = useSelector((state) => state.user)
  console.log(user);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
        return "Good morning";
    } else if (currentHour < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}


  return (
    <div className="dashboard-container dark:bg-black bg-whiten min-h-screen">
      {/* Header */}
      <header className=" p-4 text-white ">
        <h1 className="text-center sm:text-4xl text-3xl font-bold text-black dark:text-current ">{formattedDate}</h1>
        { user ? <p className="text-center text-xl mt-2 text-black dark:text-current ">{getGreeting()}, {user.displayName}!</p> : <p className="text-center text-xl mt-2 text-black dark:text-current ">{getGreeting()}, Guest!</p>}
      </header>

      {/* Day at a Glance */}
      <section className="p-4">
        {/* This is where the Day at a Glance content will go */}
      </section>

      {/* Upcoming */}
      <section className="p-4">
        {/* This is where the Upcoming content will go */}
      </section>

      {/* Progress Overview */}
      <section className="p-4">
        {/* This is where the Progress Overview content will go */}
      </section>

      {/* Footer */}
      <footer className="bg-secondary p-4 text-white">
        {/* This is where the footer content, like quick links, will go */}
      </footer>
    </div>
  );

}
