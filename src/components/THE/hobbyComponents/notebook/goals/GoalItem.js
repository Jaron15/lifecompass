// This component can be embedded within the GoalList component if you'd like, but for cleaner code, you can separate it.
function GoalItem({ goal, onToggle, onRemove }) {
    return (
      <div>
        <input 
          type="checkbox" 
          checked={goal.isCompleted}
          onChange={onToggle}
        />
        {goal.name}
        <button onClick={onRemove}>Remove</button>
      </div>
    );
  }
  
  export default GoalItem;
  