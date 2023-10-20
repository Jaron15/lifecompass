import AddGoal from '@/src/components/THE/hobbyComponents/notebook/goals/AddGoal';
import GoalList from '@/src/components/THE/hobbyComponents/notebook/goals/GoalList';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { FaPencilAlt } from 'react-icons/fa';
import EditGoalModal from '@/src/components/THE/hobbyComponents/notebook/goals/EditGoalModal';
import { render } from 'react-dom';
 

export function RadioButton({ options, value, onChange }) {
    return (
      <div className="flex bg-gray-200 p-1 rounded-md shadow-inner w-72">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex-1 text-center cursor-pointer"
          >
            <input
              type="radio"
              name="term"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only" 
            />
            <span
              className={`block py-2 rounded-md ${
                value === option.value
                  ? "bg-white font-semibold"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    );
  }
  

function GoalsTab({ hobby }) {
    const {user} = useSelector(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTerm, setModalTerm] = useState('both');

    const handleOpenModal = (term) => {
        setModalTerm(term);
        setIsModalOpen(true);
    };
    const radioOptions = [
        { value: "both", label: "All Goals" },
        { value: "short", label: "Short-term" },
        { value: "long", label: "Long-term" },
      ];
    
    
    
  const hobbyId = hobby.refId
  const [mobileSort, setMobileSort] = useState('both')
  const longTermGoals = hobby.goals ? hobby.goals.filter(goal => goal.type === 'long') : [];
  const shortTermGoals = hobby.goals ? hobby.goals.filter(goal => goal.type === 'short') : [];
  const renderGoalListContent = () => {
    if (!hobby.goals || hobby.goals.length === 0) {
      let message = "";
      switch (mobileSort) {
        case "both":
          message = "No goals added yet. Start setting goals to track your progress!";
          break;
        case "short":
          message = "No short-term goals. Set some to achieve quick wins!";
          break;
        case "long":
          message = "Outline your future goals and track your progress over time!";
          break;
      }
  
      return (
        <div className="flex h-full items-center justify-center text-center pb-32">
          <p>{message}</p>
        </div>
      );
    } else {
      return (
        <div className="h-[22rem] overflow-auto hide-scrollbar">
          <GoalList hobbyId={hobbyId} term={mobileSort} view="uncompleted" />
        </div>
      );
    }
  };
  

  return (
    <div className="grid grid-cols-2 gap-4  pb-4 ">
        {isModalOpen && <EditGoalModal closeModal={() => setIsModalOpen(false)} term={modalTerm} hobbyId={hobbyId} />}
      {/* Add Goal Form Box */}
      <div className="col-span-2 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl mb-4">
        <AddGoal user={user} hobbyId={hobbyId} />
      </div>

      {/* For larger screens: Short-term and Long-term Goals */}
      <div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block relative h-[26rem]">
    <FaPencilAlt 
    className="absolute top-4 right-5 text-xl cursor-pointer z-20"
    onClick={() => handleOpenModal('short')}
     />
    <h2 className="text-xl mb-2 text-center sticky top-0 bg-white dark:bg-boxdark z-10 pb-2">Short-term Goals</h2>
    <div className='flex justify-center'>
    <div className="h-[22rem] w-full overflow-auto hide-scrollbar xl:w-3/4 2xl:w-3/5">
    {shortTermGoals.length === 0 ? (
      <div className='h-full w-full flex items-center justify-center'>
        <p className="text-center my-4">Add some short-term goals to track your progress!</p>
        </div>
      ) : (
        <GoalList hobbyId={hobbyId} term={'short'} view="uncompleted" />
      )}
    </div>
    </div>
</div>

<div className="col-span-1 bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl hidden sm:block relative h-[26rem]">
    <FaPencilAlt 
    className="absolute top-4 right-5 text-xl cursor-pointer z-20" 
    onClick={() => handleOpenModal('long')}
    />
    <h2 className="text-xl mb-2 text-center sticky top-0 bg-white dark:bg-boxdark z-10 pb-2">Long-term Goals</h2>
    <div className='flex justify-center'>
    <div className="h-[22rem] w-full overflow-auto hide-scrollbar xl:w-3/4 2xl:w-3/5">
    {longTermGoals.length === 0 ? (
      <div className='h-full w-full flex items-center justify-center'>
        <p className="text-center my-4">Outline your future goals and track your progress over time!</p>
        </div>
      ) : (
        <GoalList hobbyId={hobbyId} term={'long'} view="uncompleted" />
      )}
    </div>
    </div>
</div>

 {/* For smaller screens: Combined Goals */}
 <div className="col-span-2 md:hidden bg-gray-200 p-4 rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow shadow-2xl sm:hidden h-[26rem] overflow-clip mb-6">
        <div className="mb-4 sticky top-0 bg-white dark:bg-boxdark z-10 flex justify-center">
        <div className="absolute top-0 right-0">
            <button 
            onClick={() => handleOpenModal(mobileSort)}>
              <FaPencilAlt />
            </button>
          </div>
          <div className='mt-6'>
          <RadioButton
            options={radioOptions}
            value={mobileSort}
            onChange={setMobileSort}
          />
          </div>
        </div>
        {renderGoalListContent()}
      </div>
    </div>
  );
}


export default GoalsTab