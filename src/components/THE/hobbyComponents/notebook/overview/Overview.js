import React from 'react'
import HobbyStreak from './HobbyStreak'

function Overview({hobby}) {
  return (
    <div>
        <HobbyStreak hobby={hobby} />
    </div>
  )
}

export default Overview