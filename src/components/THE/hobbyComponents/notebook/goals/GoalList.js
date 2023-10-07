import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addGoal, removeGoal, updateGoal } from '../../../../../redux/hobbies/hobbiesSlice';
import GoalItem from './GoalItem';



function GoalList({ hobbyId, term = 'both'  }) {
  const allGoals = useSelector(state => 
    state.hobbies.hobbies.find(hobby => hobby.refId === hobbyId)?.goals || []
  );

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
    <div className='space-y-4 '>
     
      {goals.map(goal => (
        <div key={goal.id} >
          <GoalItem 
          goal={goal}
          name={goal.name}
          checked={goal.isCompleted}
          id={goal.id}
          onToggle={(goal) => handleGoalToggle(goal)}
          onRemove={(goalId) => handleRemoveGoal(goalId)}
          />
        </div>
      ))}
      
    </div>
  );
}

export default GoalList;
