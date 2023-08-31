import React from 'react';
import DayBubble from './DayBubble';
import StreakCounter from './StreakCounter';
import StreakMessage from './StreakMessage';
import { FaFire } from 'react-icons/fa';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallStreak } from '../../redux/productivity/prodSlice';
import { useEffect } from 'react';
import { isToday, parseISO } from 'date-fns';

const calculateBubbles = (overallStreak, lastUpdatedDate) => {
    const bubbles = new Array(7).fill(false);
    const today = new Date();
    const todayDayIndex = (today.getDay() + 6) % 7; // 0 (Monday) - 6 (Sunday)
    today.setHours(0, 0, 0, 0);  
    
    let fillCount = overallStreak;
    let startingIndex = todayDayIndex;
    const lastUpdatedDateObj = new Date(lastUpdatedDate);
    lastUpdatedDateObj.setHours(0, 0, 0, 0);
    
    if (!isToday(lastUpdatedDateObj )) {
      // If last updated date was not today, start filling from yesterday
      console.log('is true');
      console.log(lastUpdatedDate);
      startingIndex = todayDayIndex - 1;
      fillCount = Math.min(fillCount, startingIndex + 1);
    } else {
        console.log('isnt true');

      // If last updated date was today, start filling from today
      fillCount = Math.min(fillCount, todayDayIndex + 1);
    }
  
    for (let i = 0; i < fillCount; i++) {
      bubbles[startingIndex - i] = true;
    }
  
    return bubbles; 
}; 

   

const StreakTracker = ({ 
    streakCount = 0, 
    completionStatus = [false, false, false, true, false, false, false],
    
}) => {
    const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user)
  const {hobbies} = useSelector((state) => state.hobbies)
  const {completedTasks} = useSelector((state) => state.tasks.completedTasks);
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
  
  const bubbles = calculateBubbles(overallStreak, lastUpdatedDate);
console.log(overallStreak);
    return (
        <div className="w-full flex flex-col
        justify-center items-center ">
          <Image src="/fire.png" alt="Fire Icon" width={40} height={40} />
            <StreakCounter count={overallStreak} />
            <div className="flex justify-center w-4/5 shrink">
                {["M", "T", "W", "T", "F", "S", "S"].map((dayName, index) => (
                    <DayBubble key={index} isCompleted={bubbles[index]} dayName={dayName} />
                ))}
            </div>
            <StreakMessage streakCount={overallStreak}  />
        </div>
    );
};

export default StreakTracker;
