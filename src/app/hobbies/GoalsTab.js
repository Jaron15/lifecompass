import AddGoal from '@/src/components/THE/hobbyComponents/notebook/goals/AddGoal';
import GoalList from '@/src/components/THE/hobbyComponents/notebook/goals/GoalList';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { FaPencilAlt } from 'react-icons/fa';
import EditGoalModal from '@/src/components/THE/hobbyComponents/notebook/goals/EditGoalModal';



function GoalsTab({ hobby }) {
    const {user} = useSelector(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  const hobbyId = hobby.refId
  const [mobileSort, setMobileSort] = useState('both')
  return (
    <div className="grid grid-cols-2 gap-4 overflow-auto pb-4">
        {isModalOpen && <EditGoalModal closeModal={() => setIsModalOpen(false)} term="long" />}
      {/* Add Goal Form Box */}
      <div className="col-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl mb-4">
        <AddGoal user={user} hobbyId={hobbyId} />
      </div>

      {/* For larger screens: Short-term and Long-term Goals */}
      <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block relative h-[26rem]">
    <FaPencilAlt className="absolute top-4 right-5 text-xl cursor-pointer z-20"
    onClick={() => setIsModalOpen(true)}
     />
    <h2 className="text-xl mb-2 text-center sticky top-0 bg-white dark:bg-boxdark z-10 pb-2">Short-term Goals</h2>
    <div className="h-[22rem] overflow-auto hide-scrollbar">
        <GoalList hobbyId={hobbyId} term={'short'} />
    </div>
</div>

<div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block relative h-[26rem]">
    <FaPencilAlt className="absolute top-4 right-5 text-xl cursor-pointer z-20" />
    <h2 className="text-xl mb-2 text-center sticky top-0 bg-white dark:bg-boxdark z-10 pb-2">Long-term Goals</h2>
    <div className="h-[22rem] overflow-auto hide-scrollbar">
        <GoalList hobbyId={hobbyId} term={'long'} 
        onClick={() => setIsModalOpen(true)}
        />
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