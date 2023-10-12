import { RadioButton } from "@/src/app/hobbies/GoalsTab";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GoalList from "./GoalList";
import { removeGoal, updateGoal } from "@/src/redux/hobbies/hobbiesSlice";

function GoalSelector({ onSelectGoal, initialTerm, closeModal, hobbyId }) {
    console.log(hobbyId);
    const allGoals = useSelector(state => 
        state.hobbies.hobbies.find(hobby => hobby.refId === hobbyId)?.goals || []
      );
console.log(allGoals);
    const [selectedTerm, setSelectedTerm] = useState(initialTerm);

    // Filter goals based on the term
    const goals = allGoals.filter(goal => {
        if (selectedTerm === 'both') return true;
        return goal.type === selectedTerm;
    });

    const radioOptions = [
      { value: "both", label: "All Goals" },
      { value: "short", label: "Short-term" },
      { value: "long", label: "Long-term" },
    ];

    
    return (
        <div className="flex flex-col h-[90%]"> 
          <div className="flex justify-center sticky top-0  z-10 py-2">
            <RadioButton
              options={radioOptions}
              value={selectedTerm}
              onChange={setSelectedTerm}
            />
          </div>
          <div className="text-center  text-xl ">
            Select goal to edit
        </div>
          {/* Scrollable List of Goals */}
          <div className="flex-grow overflow-auto hide-scrollbar">
            <ul className="flex flex-col items-center w-full py-4">
              {goals.map((goal) => {
                const borderColor =
                  goal.type === "short" ? "border-blue-400" : "border-green-400";
                return (
                  <li
                    className={`border w-full md:w-[36rem] rounded p-2 flex justify-center items-center ${borderColor} my-2 cursor-pointer`}
                    key={goal.id} onClick={() => onSelectGoal(goal)}
                  >
                    {goal.name}
                  </li>
                );
              })}
            </ul>
          </div>
  
          {/* Sticky Close Button */}
          <div className="sticky bottom-0 text-center  z-10 py-2">
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      );
  }
  
  
  function GoalEditor({ goal, onBack, closeModal, hobbyId}) {
    const [goalName, setGoalName] = useState(goal.name);
    const [goalType, setGoalType] = useState(goal.type);
    const [isComplete, setIsComplete] = useState(goal.isCompleted); 

    const {user} = useSelector(state => state.user)
  const dispatch = useDispatch();

    const handleSave = () => {
      console.log(goal);
      const updatedGoal = {
        ...goal, 
        name: goalName,
        type: goalType,
        isCompleted: isComplete
    };
    console.log(updatedGoal);
    dispatch(updateGoal({ user: user, hobbyId: hobbyId, goal: updatedGoal }));
    closeModal()
    };

    const handleDelete = () => {
      dispatch(removeGoal({ user: user, hobbyId: hobbyId, goalId: goal.id }));
      closeModal()
    };

    return (
        <div className="flex flex-col space-y-4 h-5/6">
            {/* Back Button */}
            <button className='underline' onClick={onBack}> <span className="text-xl cursor-pointer text-black dark:text-current">&#8592;</span> Back To All Goals</button>

            {/* Goal Name */}
            <div className=" w-full h-full  flex  items-center flex-col">
                <div className="w-full md:w-[36rem] flex flex-col items-center space-y-9 md:space-y-9 h-full justify-center">
            <div className="flex flex-col space-y-2 w-full text-center">
                <label htmlFor="goalName">Goal Name:</label>
                <input
                    id="goalName"
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="border rounded p-2"
                    maxLength={50} 
                />
            </div>

            {/* Goal Type (Short or Long term) */}
            <div className="flex items-center space-x-4 ">
                <label>
                    <input
                        type="radio"
                        name="goalType"
                        value="short"
                        checked={goalType === "short"}
                        onChange={() => setGoalType("short")}
                        className="mr-2"
                    />
                    Short-term
                </label>
                <label>
                    <input
                        type="radio"
                        name="goalType"
                        value="long"
                        checked={goalType === "long"}
                        onChange={() => setGoalType("long")}
                        className="mr-2"
                    />
                    Long-term
                </label>
            </div>

            {/* Goal Completion Status */}
            <div className="flex items-center space-x-4">
                <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={(e) => setIsComplete(e.target.checked)}
                />
                <label>Is Complete?</label>
            </div>

            {/* Save and Delete Buttons */}
            <div className="flex flex-col space-y-4 w-5/6 ">
                <button onClick={handleSave} className="bg-blue-500 text-white rounded p-2">
                    Save
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white rounded p-2">
                    Delete Goal
                </button>
                </div>
                </div>
            </div>
        </div>
    );
}


function EditGoalModal({ closeModal, term, hobbyId }) {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const handleCloseModal = () => {
        setSelectedGoal(null); // Reset selected goal (if any)
        closeModal(); // Close the modal
    }

    
    return (
      <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="relative bg-white 2xsm:w-full 2xsm:h-3/4 xsm:w-5/6 xsm:h-3/4 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar">
        <div className="text-center font-semibold text-3xl pb-2 underline">
            Edit Goal
        </div>
          {selectedGoal ? (
            <GoalEditor goal={selectedGoal} onBack={() => setSelectedGoal(null)} closeModal={handleCloseModal} hobbyId={hobbyId} />
          ) : (
            <GoalSelector onSelectGoal={setSelectedGoal} initialTerm={term} closeModal={handleCloseModal} hobbyId={hobbyId}/>
          )}
        </div>
      </div>
    );
  }

  export default EditGoalModal