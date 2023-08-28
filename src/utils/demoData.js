
import { format, eachDayOfInterval, startOfMonth, endOfYesterday, subDays, addDays } from 'date-fns';

export const DUMMY_USER = {
  uid: 'demo_user',
  email:'notarealuser@email.com',
  displayName: 'DEMO USER'
};
export const generateDynamicHobby = () => {
  const today = new Date();
  const currentDayName = format(today, 'EEEE');
  const daysOfWeek = ['Monday', 'Wednesday', 'Friday', currentDayName];
  const uniqueDaysOfWeek = [...new Set(daysOfWeek)]; // Ensures no duplicate days
  

  today.setDate(today.getDate() - 35);
  const adjCreatedDate = today.toISOString().split('T')[0];

  const daysInMonthSoFar = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfYesterday()
  });

  const practiceLog = daysInMonthSoFar
    .filter(day => uniqueDaysOfWeek.includes(format(day, 'EEEE')))
    .map(day => ({ date: format(day, 'yyyy-MM-dd'), timeSpent: 60 }));

  return {
    refId: `dummy-hobby-${Date.now()}`,
    name: 'Guitar',
    daysOfWeek: uniqueDaysOfWeek,
    practiceTimeGoal: 60,
    practiceLog: practiceLog,
    createdDate: adjCreatedDate 
  };
};

export const generateDynamicEventDates = (events) => {
  const today = new Date();

  const updatedEvents = [
    { ...events[0], date: format(today, 'yyyy-MM-dd') },
    { ...events[1], date: format(subDays(today, 7), 'yyyy-MM-dd') },
    { ...events[2], date: format(subDays(today, 14), 'yyyy-MM-dd') },
    { ...events[3], date: format(addDays(today, 7), 'yyyy-MM-dd') }
  ];

  return updatedEvents;

};

export const generateDynamicTaskDates = (tasks) => {
  const today = new Date();

  tasks[0].dueDate = format(today, 'yyyy-MM-dd');
  tasks[0].type = 'singular';
  tasks[0].recurringDay = '';

  tasks[1].type = 'recurring';
  tasks[1].recurringDay = 'Sunday';
  tasks[1].dueDate = '';

  tasks[2].type = 'recurring';
  tasks[2].recurringDay = 'Sunday';
  tasks[2].dueDate = '';

  tasks[3].dueDate = format(addDays(today, 7), 'yyyy-MM-dd');
  tasks[3].type = 'singular';
  tasks[3].recurringDay = '';

  return tasks;
};

// export const DUMMY_HOBBIES = [generateDynamicHobby()]
  

export function generateDynamicDummyTasks() {
  const today = new Date();
  const pastSunday = new Date(today);
  pastSunday.setDate(today.getDate() - today.getDay());
  const previousSunday = new Date(pastSunday);
  previousSunday.setDate(pastSunday.getDate() - 7);

  const nextSunday = new Date(pastSunday);
  nextSunday.setDate(pastSunday.getDate() + 7);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 5);
  today.setDate(today.getDate() - 35);
  const adjCreatedDate = today.toISOString().split('T')[0];
  const DUMMY_TASKS = [
    {
      id: 'task1',
      refId: 'task1',
      name: 'Clean the House',
      dueDate: today.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      isCompleted: false,
      type: 'singular',
      recurringDay: '',
      createdDate: adjCreatedDate
    },
    {
      id: 'task2',
      refId: 'task2',
      name: 'Laundry',
      recurringDay: 'Sunday',
      isCompleted: false,
      type: 'recurring',
      dueDate: '',
      createdDate: adjCreatedDate
    },
    {
      id: 'task3',
      refId: 'task3',
      name: 'Grocery Shopping',
      recurringDay: 'Sunday',
      isCompleted: false,
      type: 'recurring',
      dueDate: '',
      createdDate: adjCreatedDate
    },
    {
      id: 'task4',
      refId: 'task4',
      name: 'Pay Bills',
      dueDate: futureDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      isCompleted: false,
      type: 'singular',
      recurringDay: '',
      createdDate: adjCreatedDate
    },
  ];

  const DUMMY_COMPLETED_TASKS = [
    {
      id: 'completedtask1',
      refId: 'task2',
      name: 'Laundry',
      completedDate: pastSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      dueDate: pastSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
    },
    {
      id: 'completedtask2',
      refId: 'task3',
      name: 'Grocery Shopping',
      completedDate: pastSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      dueDate: pastSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
    },
    {
      id: 'completedtask3',
      refId: 'task2',
      name: 'Laundry',
      completedDate: previousSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      dueDate: previousSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
    },
    {
      id: 'completedtask4',
      refId: 'task3',
      name: 'Grocery Shopping',
      completedDate: previousSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      dueDate: previousSunday.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }
  ];


  return { DUMMY_TASKS, DUMMY_COMPLETED_TASKS };
}



  // const DUMMY_TASKS = [
  //   {
  //     id: 'task1',
  //     refId: 'task1',
  //     name: 'clean the house',
  //     dueDate: '2023-08-15',
  //     isCompleted: false,
  //     type: 'singular',
  //     recurringDay: ''
  //   },
  //   {
  //     id: 'task2',
  //     refId: 'task2',
  //     name: 'wash car',
  //     dueDate: '2023-08-16',
  //     isCompleted: false,
  //     type: 'singular',
  //     recurringDay: ''
  //   },
  //   {
  //     id: 'task3',
  //     refId: 'task3',
  //     name: 'Laundry',
  //     recurringDay: 'Sunday',
  //     isCompleted: false,
  //     type: 'recurring',
  //     dueDate: ''
  //   },
  // ];
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
  