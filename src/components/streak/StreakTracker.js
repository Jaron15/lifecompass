import React from 'react';
import DayBubble from './DayBubble';
import StreakCounter from './StreakCounter';
import StreakMessage from './StreakMessage';
import { FaFire } from 'react-icons/fa';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallStreak } from '../../redux/productivity/prodSlice';
import { useEffect } from 'react';



const StreakTracker = ({ 
    streakCount = 0,
    completionStatus = [false, false, false, false, false, false, false],
    icon = null
}) => {
    const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user)
  const {hobbies} = useSelector((state) => state.hobbies)
  const {completedTasks} = useSelector((state) => state.tasks.completedTasks);
  const {tasks} = useSelector((state) => state.tasks)
  // Select the overallStreak value from the Redux store
  const overallStreak = useSelector((state) => state.productivity.overallStreak);
  
  useEffect(() => {
    // Dispatch the action to calculate the overall streak
    if (user) {
        // Dispatch action with user object as payload
        dispatch(calculateOverallStreak({ user: user }));
      }    
  }, [dispatch, hobbies, completedTasks, tasks]);

console.log(overallStreak);
    return (
        <div className="w-full flex flex-col
        justify-center items-center ">
          <Image src="/fire.png" alt="Fire Icon" width={40} height={40} />
            <StreakCounter count={streakCount} />
            <div className="flex justify-center w-4/5 shrink">
                {["M", "T", "W", "T", "F", "S", "S"].map((dayName, index) => (
                    <DayBubble key={index} isCompleted={completionStatus[index]} dayName={dayName} />
                ))}
            </div>
            <StreakMessage streakCount={streakCount}  />
        </div>
    );
};

export default StreakTracker;
