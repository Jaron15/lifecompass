import React from 'react'
import Calendar from './Calendar'

function page() {
  return (
    <div className="flex justify-center items-center min-h-screen sm:p-4 md:p-0">
    <div className="bg-white shadow sm:p-4 rounded w-full md:max-w-lg sm:mx-auto pb-10">
    <Calendar />
  </div>
</div>

  )
}

export default page