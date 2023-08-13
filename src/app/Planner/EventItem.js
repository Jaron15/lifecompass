import React from 'react'

function EventItem({item}) {
    function convertTo12HourFormat(timeString) {
        let [hours, minutes] = timeString.split(":");
        let period = "AM";
        hours = parseInt(hours, 10);
        if (hours >= 12) {
            period = "PM";
            if (hours > 12) {
                hours -= 12;
            }
        } else if (hours === 0) {
            hours = 12;
        }
        return `${hours}:${minutes} ${period}`;
      }
  return (
    <div className="flex flex-wrap bg-gray-100 px-auto text-left  sm:text-center rounded-md text-black dark:text-white">
    <ul className="w-full sm:w-1/2">
      <li className="my-2"><strong>Time:</strong> <br/>  {item.time ? convertTo12HourFormat(item.time) : 'Not Specified'}</li>
      <li className="my-2"><strong>Repeats:</strong> <br/> {item.isRepeating === "" ? "No" : item.isRepeating}</li>
    </ul>
    <ul className="w-full sm:w-1/2">
      <li className="my-2"><strong>Description:</strong> <br/> {item.details.description || '(Not Specified)'}</li>
      <li className="my-2"><strong>Location:</strong> <br/>  {item.details.location || '(Not Specified)'}</li>
      <li className="my-2"><strong>URL:</strong> <br/> {item.details.url || '(Not Specified)'}</li>
      {item.endDate && <li><strong>End Date:</strong> {item.endDate}</li>}
    </ul>
  </div>
  )
}

export default EventItem