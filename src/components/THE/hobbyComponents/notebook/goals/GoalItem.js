import { useEffect, useState } from "react";

function GoalItem({ name, checked, goal, onToggle, onRemove, id }) {
  const [isChecked, setIsChecked] = useState(goal.isCompleted);
  useEffect(() => {
    setIsChecked(goal.isCompleted);
}, [goal.isCompleted]);

  const borderColor =
    goal.type === "short" ? "border-blue-400" : "border-green-400";
    const handleCheckboxClick = () => {
      setIsChecked(!isChecked); // immediate visual feedback
      onToggle(goal); // trigger the redux update and other effects
  };

  return (
    <div
      className={`border min-w-1/2  max-w-full rounded p-2 flex justify-between items-center ${borderColor}`}
    >
      <span>{name}</span>
      <input
        className="cursor-pointer ml-4"
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxClick} 

      />
      {/* Commented out remove button for now
            <button onClick={() => onRemove(id)}>Remove</button>
            */}
    </div>
  );
}

export default GoalItem;
