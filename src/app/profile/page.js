'use client'
import PlaceholderPage from '@/src/components/PlaceholderPage'
import React from 'react'
import { useSelector } from 'react-redux'

function page() {
  const {user} = useSelector((state) => state.user)
  const {hobbies} = useSelector(state => state.hobbies);
  const {tasks} = useSelector(state => state.tasks)
  const {events} = useSelector(state => state.events);
  const completedTasks = useSelector((state) => state.tasks.completedTasks);
console.log(tasks);
console.log(completedTasks);
  function getWeeklyCommitments(hobbies, tasks) {

    const hobbyCommitments = hobbies.reduce((total, hobby) => {
      return total + (hobby.daysOfWeek ? hobby.daysOfWeek.length : 0);
    }, 0);
  
   console.log(hobbyCommitments);
    const taskCommitments = tasks.filter(task => task.type === "recurring").length;
  
    return hobbyCommitments + taskCommitments;
  }

  
const getUpcomingEventsCount = (events) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfYear = new Date(today.getFullYear(), 11, 31); 
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate <= endOfYear;
  });

  return upcomingEvents.length;
}

const getRecentActivities = (completedTasks, hobbies) => {
  // Grabbing the most recent three completed tasks and adding 'item' property
  const recentTasks = completedTasks
    .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
    .slice(0, 3)
    .map(task => ({ ...task, item: 'task' })); // Add 'item' property

  // Collecting all practice logs across hobbies and adding 'item' and 'hobbyName' properties
  const allPracticeLogs = hobbies.flatMap(hobby => 
    hobby.practiceLog.map(log => ({
      ...log,
      item: 'hobby',
      hobbyName: hobby.name  // Add 'hobbyName' property
    }))
  );

  // Grabbing the most recent three practice sessions
  const recentPracticeSessions = allPracticeLogs
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Merging and sorting tasks and practice sessions
  const combinedActivities = [...recentTasks, ...recentPracticeSessions]
    .sort((a, b) => {
      const bDate = b.completedDate ? new Date(b.completedDate) : new Date(b.date);
      const aDate = a.completedDate ? new Date(a.completedDate) : new Date(a.date);
      return bDate - aDate;
    })
    .slice(0, 3);

  return combinedActivities;
}

const recentActivities = getRecentActivities(completedTasks, hobbies);
console.log(recentActivities);



const eventsCount = getUpcomingEventsCount(events);
const totalCommitments = getWeeklyCommitments(hobbies, tasks);

  return (
    <div className="p-4">
      {/* Profile Picture and Bio */}
      <div className="text-center md:text-left mb-6 flex flex-col w-full items-center ">
        <div className="flex justify-center md:justify-start">
          <img
            src="/path/to/profile-pic.jpg"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 border"
          />
        </div>
        <h2 className="text-2xl font-bold">{user.displayName}</h2>
        <p>Number of hobbies: {hobbies.length}</p>
        <p>weekly routine commitments: {totalCommitments}</p>
        <p>Upcoming events: {eventsCount}</p>
      </div>

      {/* Recent Activity and List of Hobbies */}
      <div className="flex flex-col items-center  sm:space-x-6 sm:space-y-6 text-center w-full">
        {/* Recent Activity */}
        <div className="sm:w-1/2 dark:bg-boxdark">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {recentActivities.map((activity, index) => (
        <div key={index} className={`p-2 rounded mb-2 ${activity.item === 'hobby' ? 'border-green-400 border-l-4' : 'border-orange-400 border-l-4'}`}>
            <p className="text-sm text-gray-600">
                {new Date(activity.item === 'hobby' ? activity.date : activity.completedDate).toLocaleDateString()}
            </p>
            {activity.item === 'hobby' ? (
                <p>Practiced {activity.hobbyName} for {activity.timeSpent} minutes</p>
            ) : (
                <p>Task completed: {activity.name}</p>
            )}
        </div>
    ))}
        </div>

        {/* List of Hobbies */}
        <div className="mt-6 sm:mt-0 sm:w-1/2">
          <h2 className="text-xl font-bold mb-4">List of Hobbies</h2>
          {/* Sample hobby */}
          <div className="bg-gray-100 p-2 rounded mb-2">Gardening</div>
          <div className="bg-gray-100 p-2 rounded mb-2">Playing Guitar</div>
        </div>
      </div>
    </div>
  );
}

export default page