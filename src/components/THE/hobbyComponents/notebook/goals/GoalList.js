import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addGoal, removeGoal, updateGoal } from '../../../../../redux/hobbies/hobbiesSlice';
import AddGoal from './AddGoal';


function GoalList({ hobbyId, term = 'both'  }) {
  const allGoals = useSelector(state => 
    state.hobbies.hobbies.find(hobby => hobby.refId === hobbyId)?.goals || []
  );

  // Filter the goals based on the term
  const goals = allGoals.filter(goal => {
    if (term === 'both') return true;
    return goal.type === term;
  });
  

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
      {/* <AddGoal user={user} hobbyId={hobbyId} /> */}
    </div>
  );
}

export default GoalList;
