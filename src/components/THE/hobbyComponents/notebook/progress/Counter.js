import React, { useState, useEffect } from 'react';

function Counter({ targetCount }) {
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    // If the current count is less than the target, increment it after a set time interval
    if (currentCount < targetCount) {
      const timeout = setTimeout(() => {
        setCurrentCount(prevCount => prevCount + 1);
      }, 100);  // Change this duration to control the speed of the animation

      // Clear the timeout if the component is unmounted
      return () => clearTimeout(timeout);
    }
  }, [currentCount, targetCount]);

  return <div>{currentCount}</div>;
}

export default Counter;
