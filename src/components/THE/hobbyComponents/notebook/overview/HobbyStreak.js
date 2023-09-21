import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StreakTracker from '@/src/components/streak/StreakTracker';
import { calculateHobbyStreak } from '@/src/redux/hobbies/hobbiesSlice';

function HobbyStreak() {

  const demoHobby = useSelector(state => state.hobbies.hobbies[0]);
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  
  const { streak, lastUpdatedDate } = demoHobby;
  console.log(streak);
  useEffect(() => {
    dispatch(calculateHobbyStreak({ user:user, hobbyId:demoHobby.refId }));
}, []);

  return (
    <StreakTracker streak={streak} lastUpdatedDate={lastUpdatedDate} />
  );
}

export default HobbyStreak;
