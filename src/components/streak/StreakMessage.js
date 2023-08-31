import React from 'react';

const StreakMessage = ({ streakCount, maxStreak }) => {
    let message;
    if (streakCount === 0 || streakCount === null) {
        message = 'No streak? No problem. Start now!'
    } else {
        message = 'Keep it up!'
    }
    return (
        <div className="flex text-center px-4 mt-4 text-xl mt-2">
            {message}
        </div>
    );
};

export default StreakMessage;
