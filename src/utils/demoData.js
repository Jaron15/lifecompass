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
  export const DUMMY_EVENTS = [
    {
      id: 'event1',
      refId: 'event1',
      name: 'Concert',
      date: '2023-08-13',
      time: '19:00',
      endDate: '',
      isRepeating: '',
      details: {
        description: 'Outdoor summer concert.',
        location: 'Downtown Park',
        url: ''
      }
    },
    {
      id: 'event2',
      refId: 'event2',
      name: 'Team Meeting',
      date: '2023-08-16',
      time: '14:00',
      endDate: '',
      isRepeating: '',
      details: {
        description: 'Monthly team meeting to discuss project progress.',
        location: 'Office',
        url: ''
      }
    },
    {
      id: 'event3',
      refId: 'event3',
      name: 'Birthday Party',
      date: '2023-08-25',
      time: '18:00',
      endDate: '',
      isRepeating: '',
      details: {
        description: "Celebrating Alex's 30th birthday.",
        location: 'Home',
        url: ''
      }
    },
    {
      id: 'event4',
      refId: 'event4',
      name: 'Dentist Appointment',
      date: '2023-08-27',
      time: '11:00',
      endDate: '',
      isRepeating: '',
      details: {
        description: 'Regular check-up.',
        location: 'Dental Clinic',
        url: ''
      }
    }
  ];
  