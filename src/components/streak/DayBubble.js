import React from 'react';

const DayBubble = ({ isCompleted, dayName }) => {

    const bubbleColor = isCompleted ? 'bg-green-500' : 'bg-gray-300';

    return (
        <div className={`shrink text-center px-3 py-1  rounded-full`}>
           <div>
            {dayName}
           </div>
           <div className={`w-4 h-4 ${bubbleColor} rounded-full`}></div>
        </div>
    );
};


export default DayBubble;
