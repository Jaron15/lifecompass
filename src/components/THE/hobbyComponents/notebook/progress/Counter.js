import React, { useState, useEffect } from 'react';

function Counter({ targetCount }) {
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
   
    if (currentCount < targetCount) {
      const timeout = setTimeout(() => {
        setCurrentCount(prevCount => prevCount + 1);
      }, 100); 


      return () => clearTimeout(timeout);
    }
  }, [currentCount, targetCount]);

  return <div>{currentCount}</div>;
}

export default Counter;
