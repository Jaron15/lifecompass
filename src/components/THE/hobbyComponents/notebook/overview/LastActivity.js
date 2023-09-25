import React from 'react';

function LastActivity({ hobby }) {
  const { lastUpdatedDate, practiceLog } = hobby;

  // Retrieve the last practice log entry
  const lastPracticeLog = practiceLog[practiceLog.length - 1];

  return (
    <div className='w-4/5 flex justify-center text-lg text-center flex-col'>
        <div className='w-full font-semibold underline'>Last Activity:</div>
        <div className='w-full'>
          {lastUpdatedDate && lastPracticeLog ? (
            <>
              <div>Date: {lastPracticeLog.date}</div>
              <div>Time Spent: {lastPracticeLog.timeSpent} minutes</div>
            </>
          ) : (
            <div>No practice session recorded yet.</div>
          )}
        </div>
    </div>
  );
}

export default LastActivity;
