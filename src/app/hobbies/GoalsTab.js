import AddGoal from '@/src/components/THE/hobbyComponents/notebook/goals/AddGoal';
import GoalList from '@/src/components/THE/hobbyComponents/notebook/goals/GoalList';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';


function GoalsTab({ hobby }) {
  const {user} = useSelector(state => state.user)
  
  const hobbyId = hobby.refId
  const [mobileSort, setMobileSort] = useState('both')
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Add Goal Form Box */}
      <div className="col-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl mb-4">
        <AddGoal user={user} hobbyId={hobbyId} />
      </div>

      {/* For larger screens: Short-term and Long-term Goals */}
      <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block">
        <h2 className="text-xl mb-2 text-center sticky top-0 bg-white dark:bg-boxdark">
          Short-term Goals
        </h2>
        <div className="h-[22rem] overflow-auto hide-scrollbar">
          <GoalList hobbyId={hobbyId} term={"short"} />
        </div>
      </div>

      <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block">
        <h2 className="text-xl mb-2 text-center sticky top-0 bg-white dark:bg-boxdark">
          Long-term Goals
        </h2>
        <div className="h-[22rem] overflow-auto hide-scrollbar">
          <GoalList hobbyId={hobbyId} term={"long"} />
        </div>
      </div>

      {/* For smaller screens: Combined Goals */}
      <div className="col-span-2 md:hidden bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl sm:hidden h-[26rem]">
    <div className="mb-2 flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-boxdark z-10">
        <h2 className="text-xl text-center">Goals</h2>
        <select
            value={mobileSort}
            onChange={(e) => setMobileSort(e.target.value)}
        >
            <option value="both">All Goals</option>
            <option value="short">Short-term</option>
            <option value="long">Long-term</option>
        </select>
    </div>
    <div className="h-[22rem] overflow-auto hide-scrollbar">
        <GoalList hobbyId={hobbyId} term={mobileSort} />
    </div>
</div>
    </div>
  );
}


export default GoalsTab