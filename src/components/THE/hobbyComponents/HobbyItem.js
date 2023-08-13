import React from 'react'
import LogPracticeForm from './LogPracticeForm'

function HobbyItem({item, date}) {
  return (
    <ul className="sm:text-center text-left text-black dark:text-white">
    <li className="my-2"><strong>Practice Days:</strong> <br/> {item.daysOfWeek.join(", ")}</li>
    <li className="my-2"><strong>Practice Time Goal:</strong> <br/> {item.practiceTimeGoal + ' Minutes'}</li>
    <LogPracticeForm hobbyId={item.refId} date={date} />
  </ul>
  )
}

export default HobbyItem