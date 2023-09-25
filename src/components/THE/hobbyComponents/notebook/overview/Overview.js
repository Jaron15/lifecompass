import React from 'react'
import HobbyStreak from './HobbyStreak'
import TimeSpent from './TimeSpent'
import LastActivity from './LastActivity'

function Overview({hobby}) {
  return (
    <div className='text-black'>
        <HobbyStreak hobby={hobby} />
        <div className='flex justify-center w-full w-4/5'>
        <TimeSpent hobby={hobby} />
        </div>
        <div className='flex justify-center w-full w-4/5'>
        <LastActivity hobby={hobby} />
        </div>
    </div>
  )
}

export default Overview