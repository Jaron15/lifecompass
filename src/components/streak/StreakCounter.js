import React from 'react';
import Image from 'next/image';

const StreakCounter = ({ count }) => {
    return (
        <>
        <Image src="/fire.png" alt="Fire Icon" width={40} height={40} />
        <div className="streak-counter text-2xl font-bold my-4 text-black dark:text-current">
            {count}
        </div>
        </>
    );
};

export default StreakCounter;
