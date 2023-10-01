import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addGoal, removeGoal, updateGoal } from '../../../../../redux/hobbies/hobbiesSlice';
import AddGoal from './AddGoal';


function GoalList({ hobbyId }) {
  const goals = useSelector(state => 
    state.hobbies.hobbies.find(hobby => hobby.refId === hobbyId)?.goals || []
  );
  
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch();

  const handleGoalToggle = (goal) => {
    console.log('triggered in component ');
    dispatch(updateGoal({ user, hobbyId, goal: { ...goal, isCompleted: !goal.isCompleted }}));
  };

  const handleRemoveGoal = (goalId) => {
    dispatch(removeGoal({ hobbyId, goalId }));
  };

  return (
    <div className='space-y-4'>
      <h2>Goals</h2>
      {goals.map(goal => (
        <div key={goal.id} >
          <input
          className='mr-2 cursor-pointer ' 
            type="checkbox" 
            checked={goal.isCompleted}
            onChange={() => handleGoalToggle(goal)}
          />
          {goal.name}
          <br />
          <button  onClick={() => handleRemoveGoal(goal.id)}>Remove</button>
        </div>
      ))}
      <AddGoal user={user} hobbyId={hobbyId} />
    </div>
  );
}

export default GoalList;
