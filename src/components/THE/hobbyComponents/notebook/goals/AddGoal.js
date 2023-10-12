import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addGoal } from '../../../../../redux/hobbies/hobbiesSlice';
import {GiBullseye} from 'react-icons/gi'
import {GiArcher} from 'react-icons/gi'

function AddGoal({ user, hobbyId }) {
  const [goalName, setGoalName] = useState('');
  const [goalType, setGoalType] = useState('short');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalName.trim()) {
      const goal = {
        id: Date.now().toString(), 
        name: goalName,
        type: goalType,
        isCompleted: false
      };
      dispatch(addGoal({ user, hobbyId, goal }));
      setGoalName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center space-y-3'>
        <label className=' text-2xl font-semibold text-black dark:text-current'>Add Goal</label>
     <div className="relative w-10/12 lg:w-1/2 bg-white rounded border h-11 flex justify-center items-center">
     <GiArcher className="absolute text-black left-2 top-1/2 transform -translate-y-1/2 text-xl " />
        <textarea 
          type="text"
          value={goalName}
          rows="2" 
          wrap="soft" 
          onChange={e => setGoalName(e.target.value)}
          placeholder="Add a new goal..."
          className='p-1 flex text-black text-center items-center resize-none hide-scrollbar h-full focus:outline-none  justify-center w-5/6 py-2 overflow-y-clip'
          maxLength={50} 
        />
        <GiBullseye className="absolute text-black right-2 top-1/2 transform -translate-y-1/2 text-xl" />
      </div>
      <div className='space-x-5'>
        <label>
          <input 
            type="radio" 
            value="short" 
            checked={goalType === 'short'}
            onChange={e => setGoalType(e.target.value)}
            className='mr-2'
          />
          Short Term
        </label>
        <label>
          <input 
            type="radio" 
            value="long" 
            checked={goalType === 'long'}
            onChange={e => setGoalType(e.target.value)}
            className='mr-2'
          />
          Long Term
        </label>
      </div>
      <button type="submit"
      className='bg-primary hover:bg-highlight focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold'
      >Add Goal</button>
    </form>
  );
}

export default AddGoal;
