import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addGoal, removeGoal, updateGoal } from '../../../../../redux/hobbies/hobbiesSlice';
import GoalItem from './GoalItem';
import { motion, AnimatePresence, useAnimation } from "framer-motion";


function GoalList({ hobbyId, term = 'both', view = 'uncompleted'   }) {
  const controls = useAnimation();

  const allGoals = useSelector(state => 
    state.hobbies.hobbies.find(hobby => hobby.refId === hobbyId)?.goals || []
    );
    
    const goals = allGoals.filter(goal => {
      if (term === 'both') return true;
    if (view === 'uncompleted') return goal.type === term && !goal.isCompleted;
    if (view === 'completed') return goal.type === term && goal.isCompleted;
    return false;
  });
  
  
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch();

  const handleGoalToggle = async (goal) => {
    // Update the checked state immediately
    dispatch(updateGoal({ user, hobbyId, goal: { ...goal, isCompleted: !goal.isCompleted }}));
    await controls.start({ opacity: 1 });  // Ensure the item is fully visible
  await controls.start({ transition: { delay: 0.3 }, opacity: 0 }); 
  };
  
  

  const handleRemoveGoal = (goalId) => {
    dispatch(removeGoal({ hobbyId, goalId }));
  };

  return (
    <div className='space-y-4 '>
      <AnimatePresence>
    {goals.map(goal => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: {delay:.75} }}
      transition={{ duration: 0.5, }}

        >
          <GoalItem 
            goal={goal}
            name={goal.name}
            checked={goal.isCompleted}
            id={goal.id}
            onToggle={(goal) => handleGoalToggle(goal)}
            onRemove={(goalId) => handleRemoveGoal(goalId)}
          />
        </motion.div>
      )
    )}
    </AnimatePresence>
  </div>
);
}

export default GoalList;
