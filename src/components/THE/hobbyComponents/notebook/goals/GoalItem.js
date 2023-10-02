
function GoalItem({ name, checked, goal, onToggle, onRemove, id }) {
  return (
    <div>
      {name}
      <input
        className="mr-2 cursor-pointer "
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(goal)}
      />
      <br />
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
}

export default GoalItem;
