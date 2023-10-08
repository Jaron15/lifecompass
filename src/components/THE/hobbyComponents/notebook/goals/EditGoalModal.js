import { RadioButton } from "@/src/app/hobbies/GoalsTab";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GoalList from "./GoalList";

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
  
  
  function GoalEditor({ goal }) {
      const [goalName, setGoalName] = useState(goal.name);
      const [goalType, setGoalType] = useState(goal.type);
      
      const handleSave = () => {
          // Update the goal...
    };
  
    const handleDelete = () => {
      // Delete the goal...
    };
  
    return (
      <div>
        {/* Input for name */}
        {/* Radio buttons for type */}
        {/* Save and Delete buttons */}
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
            <GoalEditor goal={selectedGoal} />
          ) : (
            <GoalSelector onSelectGoal={setSelectedGoal} initialTerm={term} closeModal={handleCloseModal} hobbyId={hobbyId}/>
          )}
        </div>
      </div>
    );
  }

  export default EditGoalModal