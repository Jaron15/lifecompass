import React from 'react'
import Calendar from './Calendar'
import AddForm from '../../components/THE/AddForm'

function page() {
  console.log('file name change');
  return (
    <div className="flex justify-center overflow-auto ">
    {/* <AddForm /> */}
    <Calendar />
  </div>


  )
}

export default page