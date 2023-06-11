'use client'
import React from 'react'
 import { useAuth} from '../../hooks/useAuth';


function page() {
    const { signUp } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const name = event.target.elements.name.value;
    try {
        await signUp(email, password, name);
        //add logic to navigate to home page
        
        console.log('successful!!')
      } catch (error) {
        // Handle or display the error
        console.log('error');
      }

  
  }
  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
    <label>
      Name:
      <input type="name" name="name" required />
    </label>
    <label>
      Email:
      <input type="email" name="email" required />
    </label>
    <label>
      Password:
      <input type="password" name="password" required />
    </label>
    <button type="submit" className='bg-red-500'>Sign Up</button>
  </form>
  )
}

export default page