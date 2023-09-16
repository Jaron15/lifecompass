import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import StreakTracker from '../streak/StreakTracker';
import { calculateOverallStreak } from '@/src/redux/productivity/prodSlice';

function OverallStreak() {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.user)
    const {hobbies} = useSelector((state) => state.hobbies)
    const completedTasks = useSelector((state) => state.tasks.completedTasks);
    const {tasks} = useSelector((state) => state.tasks)
    // Select the overallStreak value from the Redux store
    const overallStreak = useSelector((state) => state.productivity.overallStreak);
    const lastUpdatedDate = useSelector((state) => state.productivity.overallLastUpdatedDate);
    
    useEffect(() => { 
      // Dispatch the action to calculate the overall streak
      if (user) {
          // Dispatch action with user object as payload
          dispatch(calculateOverallStreak({ user: user }));
        }    
    }, [dispatch, hobbies, completedTasks, tasks, user,]);
    
  return (
    <StreakTracker streak={overallStreak} lastUpdatedDate={lastUpdatedDate} />
  )
}

export default OverallStreak