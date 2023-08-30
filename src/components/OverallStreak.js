import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StreakTracker from './StreakTracker';
import { calculateOverallStreak } from '../redux/productivity/prodSlice';


const SampleContainer = () => {
    const dispatch = useDispatch();
  
  // Select the overallStreak value from the Redux store
  const overallStreak = useSelector((state) => state.productivity.overallStreak);
  
  useEffect(() => {
    // Dispatch the action to calculate the overall streak
    dispatch(calculateOverallStreak());
    console.log('done');
  }, []);
console.log(overallStreak);
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
