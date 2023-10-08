import { useEffect, useState } from "react";

function GoalSelector({ onSelectGoal, initialTerm }) {
    const [currentTerm, setCurrentTerm] = useState(initialTerm);
    // Fetch goals based on currentTerm...
    // ...
  
    return (
      <div>
        {/* Dropdown for term selection */}
        {/* Render list of goals */}
        {/* On goal click: onSelectGoal(goal) */}
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

function EditGoalModal({ closeModal, term }) {
    const [selectedGoal, setSelectedGoal] = useState(null);
    useEffect(() => {
        // When the modal mounts, prevent body from scrolling
        document.body.classList.add('overflow-hidden');
    
        // When the modal unmounts, allow body to scroll again
        return () => {
          document.body.classList.remove('overflow-hidden');
        };
      }, []);
    
    return (
      <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="relative bg-white 2xsm:w-full 2xsm:h-3/4 xsm:w-5/6 xsm:h-3/4 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar">
          {selectedGoal ? (
            <GoalEditor goal={selectedGoal} />
          ) : (
            <GoalSelector onSelectGoal={setSelectedGoal} initialTerm={term} />
          )}
        </div>
      </div>
    );
  }

  export default EditGoalModal