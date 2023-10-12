import React from 'react'

function ProgressTab({hobby}) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-3/4">
        
        {/* Weekly Activity Graph */}
        <div className="col-span-2 md:col-span-1 xl:col-span-2 xl:row-span-3 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
          {/* Graph Component */}
          <div className="h-full bg-gray-300 rounded">
            {/* Placeholder for the graph */}
            Weekly Activity
          </div>
        </div>
    
        {/* Goals/Milestones Completed Box */}
        <div className="col-span-2 md:col-span-1 xl:col-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
          {/* Placeholder for Goals/Milestones */}
          Goals & Milestones Completed
        </div>
    
        {/* Practice Time Goal Achievements Box */}
        <div className="col-span-2 md:col-span-1 xl:col-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
          {/* Placeholder for Practice Time Achievements */}
          Practice Time Achievements
        </div>
    
        {/* Best Streak Box */}
        <div className="col-span-2 md:col-span-1 xl:col-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
          {/* Placeholder for Best Streak */}
          Best Streak
        </div>
    
      </div>
    )
  }
  
  

export default ProgressTab