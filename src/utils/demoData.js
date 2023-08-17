export const DUMMY_HOBBIES = [
    {
      refId: 'dummy1',
      name: 'Guitar',
      daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
      practiceTimeGoal: 60,
      practiceLog: [],
    },
    {
      refId: 'dummy2',
      name: 'Reading',
      daysOfWeek: ['Sunday'],
      practiceTimeGoal: 60,
      practiceLog: [],
    },
  ];
  
  export const DUMMY_USER = {
    uid: 'demo_user',
    email:'notarealuser@email.com',
    displayName: 'DEMO USER'
  };
  
  export const DUMMY_TASKS = [
    {
      id: 'task1',
      refId: 'task1',
      name: 'clean the house',
      dueDate: '2023-08-15',
      isCompleted: false,
      type: 'singular',
      recurringDay: ''
    },
    {
      id: 'task2',
      refId: 'task2',
      name: 'wash car',
      dueDate: '2023-08-16',
      isCompleted: false,
      type: 'singular',
      recurringDay: ''
    },
    {
      id: 'task3',
      refId: 'task3',
      name: 'Laundry',
      recurringDay: 'Sunday',
      isCompleted: false,
      type: 'recurring',
      dueDate: ''
    },
  ];
  