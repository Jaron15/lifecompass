import React from 'react';

function TimeSpent({ hobby }) {
  const accumulatedTime = hobby.practiceLog.reduce((total, log) => total + log.timeSpent, 0);

  const hours = Math.floor(accumulatedTime / 60);
  const minutes = accumulatedTime % 60;

  return (
    <div className='w-4/5 flex justify-center text-lg text-center flex-col 2xl:w-1/2'>
        <div className='w-full font-semibold underline'> Accumulated Time Spent:</div>
    <div className='w-full'>
      You have spent a total of {hours} hours {minutes} minutes Practicing!
    </div>
    </div>
  );
}

export default TimeSpent;
