import React from 'react'
import HobbyStreak from './HobbyStreak'
import TimeSpent from './TimeSpent'

function Overview({hobby}) {
  return (
    <div>
        <HobbyStreak hobby={hobby} />
        <div className='flex justify-center w-full w-4/5'>
        <TimeSpent hobby={hobby} />
        </div>
    </div>
  )
}

export default Overview