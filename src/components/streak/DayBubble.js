import React from 'react';

const DayBubble = ({ isCompleted, dayName }) => {

    const bubbleColor = isCompleted ? 'bg-radial-gradient' : 'bg-gray-300';

    return (
        <div className={`shrink text-center px-3 py-1  rounded-full text-black dark:text-current`}>
           <div>
            {dayName}
           </div>
           <div className={`w-4 h-4 ${bubbleColor} rounded-full border mt-2`}></div>
        </div>
    );
};


export default DayBubble;
