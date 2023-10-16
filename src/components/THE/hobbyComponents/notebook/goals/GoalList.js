import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeGoal, updateGoal } from '../../../../../redux/hobbies/hobbiesSlice';
import GoalItem from './GoalItem';
import { motion, AnimatePresence } from "framer-motion";


function GoalList({ hobbyId, term = 'both', view = 'uncompleted'   }) {

  const allGoals = useSelector(state => 
    state.hobbies.hobbies.find(hobby => hobby.refId === hobbyId)?.goals || []
    );
    
    const goals = allGoals.filter(goal => {
      if (term === 'both') return !goal.isCompleted;;
    if (view === 'uncompleted') return goal.type === term && !goal.isCompleted;
    if (view === 'completed') return goal.type === term && goal.isCompleted;
    return false;
  });
  
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch();

  const handleGoalToggle = async (goal) => {
    dispatch(updateGoal({ user, hobbyId, goal: { ...goal, isCompleted: !goal.isCompleted }}));
  };
  
  

  const handleRemoveGoal = (goalId) => {
    dispatch(removeGoal({ hobbyId, goalId }));
  };

  return (
    <div className='space-y-4 w-full'>
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
