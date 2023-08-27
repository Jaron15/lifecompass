import React from 'react';
import StreakTracker from './StreakTracker';


const SampleContainer = () => {
    const streakCount = 5;
    const completionStatus = [true, true, false, false, false, false, false];
    
    return (
        <div className="container mx-auto p-8 flex w-full">
            <StreakTracker 
                streakCount={streakCount} 
                completionStatus={completionStatus}   
            />
        </div>
    );
};

export default SampleContainer;
