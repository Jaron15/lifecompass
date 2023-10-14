import WeeklyChart from '@/src/components/THE/hobbyComponents/notebook/progress/WeeklyChart';
import StreakCounter from '@/src/components/streak/StreakCounter';
import React from 'react'

function ProgressTab({hobby}) {
    console.log(hobby.bestStreak);
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
            <div className="flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-2 xl:grid-cols-4 xl:grid-rows-6 gap-4 sm:h-3/4 border mb-20 sm:mb-0">
              
              {/* Weekly Activity Graph */}
              <div className="sm:col-span-1 sm:row-span-1 xl:col-span-2 xl:row-span-6 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl h-90 sm:h-full">
                <div className='w-full text-center text-lg font-semibold'>
                Average Daily Dedication
                </div>
                {/* Graph Component */}
                <div className="h-full bg-gray-300 rounded">
                  <WeeklyChart data={chartData} goal={goal} />
                </div>
              </div>
          
              {/* Goals/Milestones Completed Box */}
              <div className="sm:col-span-1 xl:col-span-2 xl:row-span-3 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
                Goals & Milestones Completed
              </div>
          
              {/* Practice Time Goal Achievements Box */}
              <div className="sm:col-span-1 xl:col-span-1 xl:row-span-3 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
                Practice Time Achievements
              </div>
          
              {/* Best Streak Box */}
              <div className="sm:col-span-1 xl:col-span-1 xl:row-span-3 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
                <div className='w-full text-center font-semibold text-lg mb-4 sm:mb-0'>
                Best Streak
                </div>
                <div className='flex flex-col w-full h-4/6 justify-center items-center'>
                <StreakCounter count={hobby.bestStreak} />
                </div>
                <div className='text-center text-lg'>
                    Your best streak so far is {hobby.bestStreak} days!
                </div>
              </div>
          
            </div>
          )
      
}
  
export default ProgressTab