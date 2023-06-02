import taskReducer, { addTask, deleteTask, completeTask } from '../redux/tasks/tasksSlice';


describe('task reducer', () => {
  const initialState = [];

  it('should handle initial state', () => {
    expect(taskReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle addTask (recurring)', () => {
    const actual = taskReducer(initialState, addTask({ name: 'Test task', recurringDay: 'Monday' }));
    expect(actual.length).toEqual(1);
    expect(actual[0]).toHaveProperty('name', 'Test task');
    expect(actual[0]).toHaveProperty('recurringDay', 'Monday');
    expect(actual[0]).toHaveProperty('isCompleted', false);
    expect(actual[0]).not.toHaveProperty('dueDate', null);
  });

  it('should handle addTask (singular)', () => {
    const actual = taskReducer(initialState, addTask({ name: 'Test task', dueDate: '2023-06-03' }));
    expect(actual.length).toEqual(1);
    expect(actual[0]).toHaveProperty('name', 'Test task');
    expect(actual[0]).toHaveProperty('dueDate', '2023-06-03');
    expect(actual[0]).toHaveProperty('isCompleted', false);
    expect(actual[0]).not.toHaveProperty('recurringDay', null);
  });

  it('should handle deleteTask', () => {
    let state = taskReducer(initialState, addTask({ name: 'Test task', recurringDay: 'Monday' }));
    const id = state[0].id;
    state = taskReducer(state, deleteTask(id));
    expect(state.length).toEqual(0);
  });

  it('should handle completeTask', () => {
    let state = taskReducer(initialState, addTask({ name: 'Test task', recurringDay: 'Monday' }));
    const id = state[0].id;
    state = taskReducer(state, completeTask(id));
    expect(state[0]).toHaveProperty('isCompleted', true);
  });
});
