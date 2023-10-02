import AddGoal from '@/src/components/THE/hobbyComponents/notebook/goals/AddGoal';
import GoalList from '@/src/components/THE/hobbyComponents/notebook/goals/GoalList';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';


function GoalsTab({ hobby }) {
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch();
  const hobbyId = hobby.refId
  return (
      <div className="grid grid-cols-2 gap-4">
          {/* Add Goal Form Box */}
          <div className="col-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl mb-4">
             <AddGoal user={user} hobbyId={hobbyId} />
          </div>

          {/* For larger screens: Short-term and Long-term Goals */}
          <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block h-[26rem]">
              <h2 className="text-xl mb-2 text-center">Short-term Goals</h2>
              <GoalList hobbyId={hobbyId} term={'short'} />
          </div>

          <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block">
              <h2 className="text-xl mb-2 text-center">Long-term Goals</h2>
              <GoalList hobbyId={hobbyId} term={'long'} />
          </div>

          {/* For smaller screens: Combined Goals */}
          <div className="col-span-2 md:hidden bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl sm:hidden h-[26rem]">
              <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-xl">Goals</h2>
                  <select>
                      <option value="all">All Goals</option>
                      <option value="short">Short-term</option>
                      <option value="long">Long-term</option>
                  </select>
              </div>
              {/* Combined list of goals based on filter */}
          </div>
      </div>
  );
}


export default GoalsTab