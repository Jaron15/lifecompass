import React from 'react';
import DayBubble from './DayBubble';
import StreakCounter from './StreakCounter';
import StreakMessage from './StreakMessage';
import { FaFire } from 'react-icons/fa';
import Image from 'next/image';



const StreakTracker = ({ 
    streakCount = 0,
    completionStatus = [false, false, false, false, false, false, false],
    icon = null
}) => {
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
