import WeeklyChart from '@/src/components/THE/hobbyComponents/notebook/progress/WeeklyChart';
import React from 'react'

function ProgressTab({hobby}) {
    const getDayOfWeek = (dateString) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(dateString);
        return days[date.getDay()];
      };
      
      const formatDataForChart = (practiceLog) => {
        
        const daysAccumulator = {
            "Sunday": { timeSpent: 0, count: 0 },
            "Monday": { timeSpent: 0, count: 0 },
            "Tuesday": { timeSpent: 0, count: 0 },
            "Wednesday": { timeSpent: 0, count: 0 },
            "Thursday": { timeSpent: 0, count: 0 },
            "Friday": { timeSpent: 0, count: 0 },
            "Saturday": { timeSpent: 0, count: 0 }
        };
       
        practiceLog.forEach(log => {
            const dayOfWeek = getDayOfWeek(log.date);
            daysAccumulator[dayOfWeek].timeSpent += log.timeSpent;
            daysAccumulator[dayOfWeek].count += 1;
        });

        const chartData = Object.keys(daysAccumulator).map(day => ({
            name: day,
            timeSpent: daysAccumulator[day].count > 0 
                ? daysAccumulator[day].timeSpent / daysAccumulator[day].count 
                : 0
        }));
    
        return chartData;
    };
    
      const chartData = formatDataForChart(hobby.practiceLog);
        console.log(chartData);
        const goal = hobby.practiceTimeGoal
        return (
            <div className="grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-2 xl:grid-cols-6 xl:grid-rows-6 gap-4 h-3/4 border">
              
              {/* Weekly Activity Graph */}
              <div className="col-span-1 row-span-5 sm:col-span-1 sm:row-span-1 xl:col-span-3 xl:row-span-6 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
                <div className='w-full text-center text-lg font-semibold'>
                Average Daily Dedication Overview
                </div>
                {/* Graph Component */}
                <div className="h-full bg-gray-300 rounded">
                  <WeeklyChart data={chartData} goal={goal} />
                </div>
              </div>
          
              {/* Goals/Milestones Completed Box */}
              <div className="col-span-1 row-span-1 sm:col-span-1 xl:col-span-3 xl:row-span-4 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
                Goals & Milestones Completed
              </div>
          
              {/* Practice Time Goal Achievements Box */}
              <div className="col-span-1 row-span-1 sm:col-span-1 xl:col-span-3 xl:row-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
                Practice Time Achievements
              </div>
          
              {/* Best Streak Box */}
              <div className="col-span-1 row-span-1 sm:col-span-1 xl:col-span-3 xl:row-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
                Best Streak
              </div>
          
            </div>
          )
      
}
  
export default ProgressTab