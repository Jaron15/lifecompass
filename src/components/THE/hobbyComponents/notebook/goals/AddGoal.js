import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addGoal } from '../../../../../redux/hobbies/hobbiesSlice';

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
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={goalName}
        onChange={e => setGoalName(e.target.value)}
        placeholder="Add a new goal..."
      />
      <div>
        <label>
          <input 
            type="radio" 
            value="short" 
            checked={goalType === 'short'}
            onChange={e => setGoalType(e.target.value)}
          />
          Short Term
        </label>
        <label>
          <input 
            type="radio" 
            value="long" 
            checked={goalType === 'long'}
            onChange={e => setGoalType(e.target.value)}
          />
          Long Term
        </label>
      </div>
      <button type="submit">Add Goal</button>
    </form>
  );
}

export default AddGoal;
