import React from 'react';

const StreakCounter = ({ count }) => {
    return (
        <div className="streak-counter text-2xl font-bold my-4">
            {count}
        </div>
    );
};

export default StreakCounter;
