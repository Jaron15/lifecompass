import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { selectMonthlyProductivityScores, selectWeeklyProductivityScores  } from '../redux/hobbies/hobbiesSlice'
import { calculateMonthlyTaskProductivity, calculateWeeklyTaskProductivity, selectTasksProductivityScores } from '../redux/tasks/tasksSlice';


const CustomLegend = ({ payload }) => (
  <div className="flex items-center space-x-2 md:space-x-4 justify-center w-full ml-5">
    {payload.map((entry, index) => (
      <div key={`item-${index}`} className="flex items-center mt-4">
        <div
          className="w-4 h-4 mr-1 sm:mr-2"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm">{entry.value}</span>
      </div>
    ))}
  </div>
);
const CustomTooltip = ({ active, payload, label }) => {
    
    if (active && payload && payload.length) {
      return (
          <div className="custom-tooltip" style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid #ccc' }}>
         
          <p className="label">{`${payload[0].payload.fullString}: ${payload[0].value}%`}</p>
  
        </div>
      );
    }
  
    return null;
  };
  

const ProductivityChart = () => {
    const initialData = [
        { name: 'Overall', value: 100, color: '#34b5b9', fullString: 'Overall Productivity Score'},
        { name: 'Tasks', value: 100, color: 'rgb(234 179 8)', fullString: 'Tasks Completed On Time' },
        { name: 'Hobbies', value: 100, color: 'rgb(22 163 74)', fullString: 'Hobbies Goals Met' },
      ];
    
// Productivity Score
// Completed On Time
// Goals Met
      
  const [timePeriod, setTimePeriod] = useState('Weekly');
  const [overallProductivityScore, setOverallProductivityScore] = useState(0);
  const hobbyProductivityScoreWeekly = useSelector(selectWeeklyProductivityScores);
  const hobbyProductivityScoreMonthly = useSelector(selectMonthlyProductivityScores);
  const tasksProductivityScoreWeekly = useSelector(calculateWeeklyTaskProductivity);
  const tasksProductivityScoreMonthly = useSelector(calculateMonthlyTaskProductivity);
  
  
  const [chartData, setChartData] = useState(initialData);

useEffect(() => {
  const hobbiesProductivityScore = timePeriod === 'Weekly' ? hobbyProductivityScoreWeekly : hobbyProductivityScoreMonthly;

  const tasksProductivityScore = timePeriod === 'Weekly' ? tasksProductivityScoreWeekly : tasksProductivityScoreMonthly;

  const updatedChartData = chartData.map((data) => {
    if (data.name === 'Tasks') {
        return {
            ...data,
            value: tasksProductivityScore,
        };
    } else if (data.name === 'Hobbies') {
        return {
            ...data,
            value: hobbiesProductivityScore,
        };
    }
    return data;
});

    const dataForCalculation = updatedChartData.filter(data => data.name !== 'Overall');

    const newOverallProductivityScore = (
        dataForCalculation.reduce((acc, item) => acc + item.value, 0) / dataForCalculation.length
      ).toFixed(2);
    
    setOverallProductivityScore(newOverallProductivityScore);
 
    const newChartData = updatedChartData.map((data) => {
        if (data.name === 'Overall') {
          return {
            ...data,
            value: parseFloat(newOverallProductivityScore),
          };
        }
        return data;
      });
      
      setChartData(newChartData);
    
    }, [hobbyProductivityScoreWeekly, hobbyProductivityScoreMonthly, tasksProductivityScoreWeekly, tasksProductivityScoreMonthly, timePeriod]);
  
  
  

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };
  

  return (
    <div className="flex flex-col items-center space-y-2 h-[27.5rem]  w-full text-black dark:text-current -mt-4 xl:-mt-1">
      <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Productivity Chart</h2>
        <select
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="p-2 bg-white border rounded shadow dark:bg-boxdark cursor-pointer"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="75%" >
        <BarChart
          data={chartData}
          className="-ml-5"
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
          
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="name" /> */}
          <YAxis unit="%" />
          <Tooltip content={<CustomTooltip payload={
            chartData.map(item => ({
              name: item.name,
              value: item.value,
              type: 'square',
              color: item.color,
            }))
          } />}  />
          <Legend content={<CustomLegend />} payload={
            chartData.map(item => ({
              value: item.name,
              type: 'square',
              color: item.color,
            }))
          }/>
          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <span className="text-lg font-semibold text-center">
        Overall Productivity Score: {overallProductivityScore}%
      </span>
    </div>
  );
};

export default ProductivityChart;
