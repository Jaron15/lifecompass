import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DistributionChart = () => {
  const [timePeriod, setTimePeriod] = useState('Weekly');
  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const {hobbies} = useSelector(state => state.hobbies);
  const {events} = useSelector(state => state.events);
  const {tasks} = useSelector(state => state.tasks)
  
 
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  //weekly numbers
  const getStartEndOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(date.getDay() === 0 ? start.getDate() + 1 : start.getDate() - date.getDay() + 1); // Adjust for Sunday
    start.setHours(0, 0, 0, 0); // Set time to start of day
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999); // Set time to end of day
    return [start, end];
  };
 //monthly numbers 
 const getStartEndOfMonth = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setHours(0, 0, 0, 0);  // Set time to start of day
  
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);  // Set time to end of day

  return [start, end];
};

let startDate, endDate;
if (timePeriod === 'Weekly') {
  [startDate, endDate] = getStartEndOfWeek(new Date());
} else if (timePeriod === 'Monthly') {
  [startDate, endDate] = getStartEndOfMonth(new Date());
} else {
  // We will handle "All Time" later
  // For now, just use the entire range of possible dates
  startDate = new Date(-8640000000000000);  // Earliest possible date in JS
  endDate = new Date(8640000000000000);  // Latest possible date in JS
}

const tasksForPeriod = tasks.flatMap(task => {
  // For singular tasks
  if(task.type === 'singular') {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0); // To ensure it's at the start of the day

    if (taskDate >= startDate && taskDate <= endDate) {
      return [task];
    }
    return [];
  }
  // For recurring tasks
  else if(task.type === 'recurring') {
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(task.recurringDay);
    
    let currentDate = new Date(startDate);
    let recurringTasks = [];

    while (currentDate <= endDate) {
      if (currentDate.getDay() === dayIndex) {
        recurringTasks.push({...task, date: currentDate.toString()}); 
        // Clone the task with a specific date for clarity
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return recurringTasks;
  }
  return [];
});


const hobbyDaysForPeriod = hobbies.flatMap(hobby => {
  return hobby.daysOfWeek.flatMap(dayOfWeek => {
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayOfWeek);
    
    let currentDate = new Date(startDate);
    let hobbySessions = [];

    while (currentDate <= endDate) {
      if (currentDate.getDay() === dayIndex) {
        hobbySessions.push({...hobby, date: currentDate.toString()}); 
        // Clone the hobby with a specific date for clarity
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return hobbySessions;
  });
});


const eventsForPeriod = events.filter(event => {
  const [year, month, day] = event.date.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  eventDate.setHours(0, 0, 0, 0);
  
  return eventDate >= startDate && eventDate <= endDate;
});
console.log(startDate, endDate);
  console.log('results: ', tasksForPeriod,hobbyDaysForPeriod, eventsForPeriod);
  
  const chartData = [
    
    { name: 'Tasks', value: tasksForPeriod.length, color: 'rgb(234 179 8)' }, 
    { name: 'Hobbies', value: hobbyDaysForPeriod.length, color: 'rgb(22 163 74)' }, 
    { name: 'Events', value: eventsForPeriod.length, color: 'rgb(37 99 235)' } 
  ];


  return (
    <div className="flex flex-col items-center space-y-2 h-full  w-full text-black dark:text-current -mt-4 xl:-mt-1">
    <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-gray-300">
      <h2 className="text-lg font-semibold">Time Distribution Chart</h2>
      <select
        value={timePeriod}
        onChange={handleTimePeriodChange}
        className="p-2 bg-white border rounded shadow dark:bg-boxdark cursor-pointer"
      >
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Monthly">All Time</option>
      </select>
    </div>
    <ResponsiveContainer height='100%' width='100%'>
    <PieChart width={400} height={400} >
      <Pie
        dataKey="value"
        startAngle={360}
        endAngle={0}
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={120}
        
        label
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
    </ResponsiveContainer>
    </div> 
  );
};

export default DistributionChart;
