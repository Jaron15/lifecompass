import React, { useState } from 'react';
import { FaPencilAlt, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { updateHobby } from '@/src/redux/hobbies/hobbiesSlice'; 


function HobbyDetails({hobby}) {
  const {user} = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const weekdaysFull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weekendFull = ["Saturday", "Sunday"];
    const weekdays = weekdaysFull.map(day => day.substring(0, 3));
    const weekend = weekendFull.map(day => day.substring(0, 3));

    const [editing, setEditing] = useState(false);
    const [selectedDays, setSelectedDays] = useState(hobby.daysOfWeek);

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(prev => prev.filter(d => d !== day));
        } else {
            setSelectedDays(prev => [...prev, day]);
        }
    }

    const saveChanges = () => {
        dispatch(updateHobby({user:user, hobby:{...hobby, daysOfWeek: selectedDays}})); 
        setEditing(false);
    }

    const daysToDisplay = editing ? selectedDays.map(day => day.substring(0, 3)) : hobby.daysOfWeek.map(day => day.substring(0, 3));

    return (
      <div className="flex flex-col items-center w-full h-full relative">
        <div className='w-full flex flex-col items-center space-y-4 relative'>
        { !editing && 
            <div className="absolute top-3 right-3 cursor-pointer z-40" onClick={() => setEditing(true)}>
                <FaPencilAlt />
            </div>
        }
        { editing && 
            <div className="absolute top-3 right-3 cursor-pointer z-40" onClick={saveChanges}>
                <FaCheck />
            </div>
        }
        <div className='underline font-semibold text-lg'>Practice Days</div>
        <div className="flex space-x-2 md:space-x-4">
          {weekdays.map((day) => (
            <div 
                key={day} 
                onClick={editing ? () => toggleDay(weekdaysFull[weekdays.indexOf(day)]) : undefined}
                className={`border-2 ${daysToDisplay.includes(day) ? 'border-cyan-600 dark:shadow-glow shadow-glowSm shadow-cyan-600' : 'border-zinc-300 dark:border-zinc-400'} bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center ${editing ? 'cursor-pointer' : 'cursor-default'}`}
            >
                <span className="text-sm font-semibold">{day}</span>
            </div>
          ))}
        </div>
        <div className="flex space-x-2 md:space-x-4">
          {weekend.map((day) => (
            <div 
                key={day} 
                onClick={editing ? () => toggleDay(weekendFull[weekend.indexOf(day)]) : undefined}
                className={`border-2 ${daysToDisplay.includes(day) ? 'border-cyan-600 dark:shadow-glow shadow-glowSm shadow-cyan-600' : 'border-zinc-300 dark:border-zinc-400'} bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center`}
            >
                <span className="text-sm font-semibold">{day}</span>
            </div>
          ))}
        </div>
        <div className='underline font-semibold text-lg pt-4'>Practice Time Goal</div>
        <div>
            {hobby.practiceTimeGoal} Minutes
        </div>
        </div>
      </div>
    );
}


export default HobbyDetails;
