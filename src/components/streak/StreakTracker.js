import React from 'react';
import DayBubble from './DayBubble';
import StreakCounter from './StreakCounter';
import StreakMessage from './StreakMessage';
import { isToday, parseISO } from 'date-fns';

const calculateBubbles = (streak, lastUpdatedDate) => {
    const bubbles = new Array(7).fill(false);
    const today = new Date();
    const todayDayIndex = (today.getDay() + 6) % 7; // 0 (Monday) - 6 (Sunday)
    today.setHours(0, 0, 0, 0);  
    
    let fillCount = streak;
    let startingIndex = todayDayIndex;
    const lastUpdatedDateObj = new Date(lastUpdatedDate);
    lastUpdatedDateObj.setHours(0, 0, 0, 0);
    
    if (!isToday(lastUpdatedDateObj )) {
      // If last updated date was not today, start filling from yesterday
      startingIndex = todayDayIndex - 1;
      fillCount = Math.min(fillCount, startingIndex + 1);
    } else {
        console.log('is today');

      // If last updated date was today, start filling from today
      fillCount = Math.min(fillCount, todayDayIndex + 1);
    }
  
    for (let i = 0; i < fillCount; i++) {
      bubbles[startingIndex - i] = true;
    }
  
    return bubbles; 
}; 

   

const StreakTracker = ({ 
streak, lastUpdatedDate 
}) => {
  const bubbles = calculateBubbles(streak, lastUpdatedDate);
console.log(streak);
    return (
        <div className="w-full flex flex-col
        justify-center items-center ">
            <StreakCounter count={streak} />
            <div className="flex justify-center w-4/5 shrink">
                {["M", "T", "W", "T", "F", "S", "S"].map((dayName, index) => (
                    <DayBubble key={index} isCompleted={bubbles[index]} dayName={dayName} />
                ))}
            </div>
            <StreakMessage streakCount={streak}  />
        </div>
    );
};

export default StreakTracker;
