import React from 'react'
import HobbyStreak from './HobbyStreak'
import TimeSpent from './TimeSpent'
import LastActivity from './LastActivity'

function Overview({hobby}) {
  return (
    <div className='text-black'>
      <div className='flex justify-center w-full md:py-6 2xl:pt-10'>
        <HobbyStreak hobby={hobby} />
        </div>
        <div className='flex justify-center w-full py-4 md:py-6'>
        <TimeSpent hobby={hobby} />
        </div>
        <div className='flex justify-center w-full md:pb-10 xl:pt-6'>
        <LastActivity hobby={hobby} />
        </div>
    </div>
  )
}

export default Overview