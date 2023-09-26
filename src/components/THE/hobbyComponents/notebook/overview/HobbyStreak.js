import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StreakTracker from '@/src/components/streak/StreakTracker';
import { calculateHobbyStreak } from '@/src/redux/hobbies/hobbiesSlice';


function HobbyStreak({hobby}) {

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  
  // If streak is undefined, set it to 0
  const streak = hobby.streak !== undefined ? hobby.streak : 0;
  const { lastUpdatedDate } = hobby;


  useEffect(() => {
    dispatch(calculateHobbyStreak({ user:user, hobbyId:hobby.refId }));
}, [hobby]);

  return (
    <div className='full flex justify-center text-lg text-center flex-col'>
    <div className='w-full font-semibold underline'>Current Streak:</div>
    <StreakTracker streak={streak} lastUpdatedDate={lastUpdatedDate} />
    </div>
  );
}

export default HobbyStreak;
