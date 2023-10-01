import React from 'react'
import GoalList from './GoalList'

function Goals(hobby) {
    
  return (
    <div className='flex justify-center w-full md:py-6 2xl:pt-10'>
    <GoalList hobbyId={hobby.hobby.refId} />
    </div>
  )
}

export default Goals