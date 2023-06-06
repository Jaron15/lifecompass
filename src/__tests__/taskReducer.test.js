import taskReducer, { addTask, deleteTask, completeTask } from '../redux/tasks/tasksSlice';


describe('task reducer', () => {
  const initialState = [];

  it('should handle initial state', () => {
    expect(taskReducer(undefined, {})).toEqual(initialState);
  });

    it('should handle addTask (recurring)', () => {
      const initialState = [];
      const action = addTask({ type: 'recurring', name: 'Clean mirrors', schedule: ['Monday', 'Thursday'] });
      const actual = taskReducer(initialState, action);
      expect(actual).toHaveLength(1);
      expect(actual[0]).toHaveProperty('name', 'Clean mirrors');
      expect(actual[0]).toHaveProperty('recurringDay', ['Monday', 'Thursday']);
      expect(actual[0]).toHaveProperty('isCompleted', false);
      expect(actual[0]).toHaveProperty('dueDate', null);
    });
  
    it('should handle addTask (singular)', () => {
      const initialState = [];
      const action = addTask({ type: 'singular', name: 'Return package', schedule: '2023-06-03' });
      const actual = taskReducer(initialState, action);
      expect(actual).toHaveLength(1);
      expect(actual[0]).toHaveProperty('name', 'Return package');
      expect(actual[0]).toHaveProperty('dueDate', '2023-06-03');
      expect(actual[0]).toHaveProperty('isCompleted', false);
      expect(actual[0]).toHaveProperty('recurringDay', null);
    });
  

  it('should handle deleteTask (recurring)', () => {
    let state = taskReducer(initialState, addTask({ type: 'recurring', name: 'Test task', schedule: ['Monday'] }));
    const id = state[0].id;
    state = taskReducer(state, deleteTask(id));
    expect(state.length).toEqual(0);
  });
  
  it('should handle deleteTask (singular)', () => {
    let state = taskReducer(initialState, addTask({ type: 'singular', name: 'Test task', schedule: '2023-06-03' }));
    const id = state[0].id;
    state = taskReducer(state, deleteTask(id));
    expect(state.length).toEqual(0);
  });

  it('should handle completeTask (recurring)', () => {
    let state = taskReducer(initialState, addTask({ type: 'recurring', name: 'Test task', schedule: ['Monday'] }));
    const id = state[0].id;
    state = taskReducer(state, completeTask(id));
    expect(state[0]).toHaveProperty('isCompleted', true);
  });
  it('should handle completeTask (singular)', () => {
    let state = taskReducer(initialState, addTask({ type: 'singular', name: 'Test task', schedule: '2023-06-03' }));
    const id = state[0].id;
    state = taskReducer(state, completeTask(id));
    expect(state[0]).toHaveProperty('isCompleted', true);
  });
});
