function GoalItem({ name, checked, goal, onToggle, onRemove, id }) {
  const borderColor =
    goal.type === "short" ? "border-blue-400" : "border-green-400";

  return (
    <div
      className={`border min-w-1/2  max-w-full rounded p-2 flex justify-between items-center ${borderColor}`}
    >
      <span>{name}</span>
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(goal)}
      />
      {/* Commented out remove button for now
            <button onClick={() => onRemove(id)}>Remove</button>
            */}
    </div>
  );
}

export default GoalItem;
