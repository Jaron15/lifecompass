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

    console.log(start);
    console.log(end);
    return [start, end];
};
//weekly numbers
const [startOfWeek, endOfWeek] = getStartEndOfWeek(new Date());


  
  const tasksThisWeek = tasks.filter(task => {
    if(task.type === 'singular') {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    }
    if(task.type === 'recurring') {
      // Convert recurringDay to a date for this week and check if it's in range
      const taskDate = new Date();
      taskDate.setDate(startOfWeek.getDate() + ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(task.recurringDay));
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    }
  });
  
  const hobbyDaysThisWeek = hobbies.flatMap(hobby => {
    const hobbyDays = hobby.daysOfWeek;
    const daysThisWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return hobbyDays.filter(day => daysThisWeek.includes(day));
});
   
  const eventsThisWeek = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });
  
  console.log('results: ', tasksThisWeek,hobbyDaysThisWeek, eventsThisWeek);
  //weekly numbers


  const chartData = [
    
    { name: 'Tasks', value: tasksThisWeek.length, color: 'rgb(234 179 8)' }, 
    { name: 'Hobbies', value: hobbyDaysThisWeek.length, color: 'rgb(22 163 74)' }, 
    { name: 'Events', value: eventsThisWeek.length, color: 'rgb(37 99 235)' } 
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
