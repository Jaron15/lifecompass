'use client'
import { useEffect, useState } from 'react';
import SignUpForm from './signup/SignUpForm';
import SignInForm from './signin/SignInForm';


export default function LandingPage() {
  const [form, setForm] = useState(null);

  const handleSignUp = () => {
    setForm('signUp');
  };

  const handleSignIn = () => {
    setForm('signIn');
  };

  const handleDemo = () => {
    // Navigate to the demo page, or trigger the demo mode
    setForm('demo');
  };

  return (
    <div className="flex flex-col items-center sm:justify-center bg-[#F3F4F6]  min-h-screen w-screen bg-gradient-to-b from-transparent via-whiten to-white dark:bg-black dark:to-transparent dark:via-transparent ">
      <div className='flex flex-col items-center justify-center w-10/12 lg:max-w-[1000px] sm:-mt-30'>

      {form === null && (
          <div className="text-center dark:text-white text-black space-y-5 sm:space-y-6 p-8">
            <h1 className="text-5xl font-bold dark:text-white">
              Organize Your Life, Effortlessly
            </h1>
            <h2 className="text-2xl font-semibold dark:text-gray-300">
              Welcome to Life Compass
            </h2>
            <p className="text-lg dark:text-gray-400">
              A simple, intuitive, and powerful time management tool designed to help you stay organized and focused on what matters most to you.
            </p>
          </div>
        )}
        
      {form === 'signUp' && 
        <div className='w-full flex justify-center mt-4 sm:mt-0'>
          <SignUpForm />
        </div>
      }

      {form === 'signIn' && 
        <div className='w-full flex justify-center mt-4 sm:mt-0'>
          <SignInForm />
        </div>
      }

      <div className={`mt-4 w-full ${form ? 'flex space-x-4' : 'grid grid-cols-6 gap-4 sm:gap-6 md:max-w-[48rem]'}`}>
        {form !== 'signUp' && (
          <button className={`${form ? ' w-full flex items-center align-middle' : 'col-span-3'} flex justify-center  px-6 py-3 text-lg font-semibold dark:text-white rounded-md dark:bg-primary border-2 border-highlight  text-black  hover:shadow hover:shadow-lg hover:shadow-highlightglow hover:scale-105 ease-in-out
          duration-300`} onClick={handleSignUp}>
            Sign Up
          </button>
        )}
        
        {form !== 'signIn' && (
          <button className={`${form ? ' w-full flex items-center' : 'col-span-3'} flex justify-center  px-6 py-3 text-lg font-semibold dark:text-white rounded-md dark:bg-primary border-2 border-highlight  text-black  hover:shadow hover:shadow-lg hover:shadow-highlightglow hover:scale-105 ease-in-out
          duration-300 `} onClick={handleSignIn}>
            Sign In
          </button>
        )}
        
        <button className={`${form ? ' w-full flex items-center' : 'col-span-6 sm:col-span-6'} flex justify-center  px-6 py-3 text-lg font-semibold text-white rounded-md bg-primary hover:shadow hover:shadow-lg hover:shadow-highlightglow hover:scale-105 ease-in-out dark:bg-whiten border-2 border-highlight dark:text-black
        duration-300`} onClick={handleDemo}>
          Use Demo Version
        </button>
      </div>
      </div>
    </div>
  );
}



// export default LandingPage;
