import React from 'react'
import HobbyStreak from '@/src/components/THE/hobbyComponents/notebook/overview/HobbyStreak';
import LastActivity from '@/src/components/THE/hobbyComponents/notebook/overview/LastActivity';
import TimeSpent from '@/src/components/THE/hobbyComponents/notebook/overview/TimeSpent';
import HobbyDetails from '@/src/components/THE/hobbyComponents/notebook/overview/HobbyDetails';

function OverviewTab({hobby}) {
  return (
    <div className="grid grid-cols-2 gap-4">
    {/* Active Streak Box */}
    <div className="col-span-1 row-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
      <HobbyStreak hobby={hobby} />
      {/* Active Streak Content */}
    </div>
  
    {/* Details Box */}
    <div className="col-span-1 row-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
      <HobbyDetails hobby={hobby} />
    </div>
  
    {/* Last Activity Box */}
    <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark flex justify-center shadow shadow-2xl">
     <LastActivity hobby={hobby} />
    </div>
  
    {/* Accumulated Time Box */}
    <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark flex justify-center shadow shadow-2xl">
      <TimeSpent hobby={hobby}/>
    </div>
  </div>
  )
}

export default OverviewTab