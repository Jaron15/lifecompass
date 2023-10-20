import GoalList from '@/src/components/THE/hobbyComponents/notebook/goals/GoalList';
import Counter from '@/src/components/THE/hobbyComponents/notebook/progress/Counter';
import WeeklyChart from '@/src/components/THE/hobbyComponents/notebook/progress/WeeklyChart';
import StreakCounter from '@/src/components/streak/StreakCounter';
import React, { useState } from 'react'
import { RadioButton } from './GoalsTab';

function ProgressTab({hobby}) {
    const goal = hobby.practiceTimeGoal;
    const hobbyId = hobby.refId;
    console.log(hobbyId);
    // Chart data start ---------------
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
        // Chart data end ---------------
        
        const countDaysMeetingGoal = (practiceLog, practiceTimeGoal) => {
        
            const groupedByDate = practiceLog.reduce((acc, log) => {
              if (acc[log.date]) {
                acc[log.date].push(log.timeSpent);
              } else {
                acc[log.date] = [log.timeSpent];
              }
              return acc;
            }, {});
          
            
            const sumsByDate = Object.keys(groupedByDate).reduce((acc, date) => {
              acc[date] = groupedByDate[date].reduce((sum, time) => sum + time, 0);
              return acc;
            }, {});
            const count = Object.values(sumsByDate).reduce((acc, sum) => (sum >= practiceTimeGoal ? acc + 1 : acc), 0);
          
            return count;
          };
          
          // Usage:
          const totalDaysMeetingGoal = countDaysMeetingGoal(hobby.practiceLog, goal);
          console.log(`Total days meeting the practice goal: ${totalDaysMeetingGoal}`);
          
        const [goalSort, setGoalSort] = useState('long');
        const radioOptions = [
            { value: "long", label: "Milestones" },
            { value: "short", label: "Goals" },
          ];
        return (
          <div className="flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-2 xl:grid-cols-4 xl:grid-rows-6 gap-4 sm:h-3/4  mb-20 sm:mb-0">
            {/* Weekly Activity Graph */}
            <div className="sm:col-span-1 sm:row-span-1 xl:col-span-2 xl:row-span-6 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl h-90 sm:h-full">
              <div className="w-full text-center text-lg font-semibold">
                Average Daily Dedication
              </div>
              {/* Graph Component */}
              <div className="h-full bg-gray-300 rounded">
                <WeeklyChart data={chartData} goal={goal} />
              </div>
            </div>

            {/* Goals/Milestones Completed Box */}
            <div className="sm:col-span-1 xl:col-span-2 xl:row-span-4 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl h-80 sm:h-full">
              <div className="w-full text-center flex justify-center">
                <RadioButton
                  options={radioOptions}
                  value={goalSort}
                  onChange={setGoalSort}
                />
              </div>
              <div className="flex h-[85%] items-center justify-center w-full">
                <div className=" w-full 2xl:w-5/6 overflow-y-scroll hide-scrollbar max-h-full py-4">
                  {hobby.goals &&
                  hobby.goals.some(
                    (goal) => goal.type === goalSort && goal.isCompleted
                  ) ? (
                    <GoalList
                      hobbyId={hobbyId}
                      term={goalSort}
                      view="completed"
                    />
                  ) : (
                    <div className="text-center text-gray-600">
                      {goalSort === "long"
                        ? "Complete some long term goals to see them here!"
                        : "Complete some short term goals to see them here!"}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Practice Time Goal Achievements Box */}
            <div className="sm:col-span-1 xl:col-span-1 xl:row-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
              <div className="w-full text-center text-lg font-semibold">
                Practice Time Wins
              </div>
              <div className="w-full text-center h-4/6 flex items-center justify-center text-7xl my-4 sm:my-0 xl:h-1/2 xl:my-2 ">
                <Counter targetCount={totalDaysMeetingGoal} />
              </div>
              <div className="w-full text-center text-lg ">
                {"Total times you've met your practice goal!"}
              </div>
            </div>

            {/* Best Streak Box */}
            <div className="sm:col-span-1 xl:col-span-1 xl:row-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl">
              <div className="w-full text-center font-semibold text-lg mb-4 sm:mb-0 xl:mb-6">
                Best Streak
              </div>
              <div className="flex flex-col w-full h-4/6 justify-center items-center xl:h-1/2">
                <StreakCounter count={hobby.bestStreak} />
              </div>
              <div className="text-center text-lg">
                Your best streak so far is {hobby.bestStreak} days!
              </div>
            </div>
          </div>
        );
      
}
  
export default ProgressTab