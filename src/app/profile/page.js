'use client'
import PlaceholderPage from '@/src/components/PlaceholderPage'
import HobbyDetails from '@/src/components/THE/hobbyComponents/notebook/overview/HobbyDetails'
import React, { useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import ImageSelector from './ImageSelector'
import { updateUserProfile } from '@/src/redux/user/userSlice'
import useCheckAuth from '@/src/hooks/useCheckAuth';

function Page() {
  useCheckAuth()
  const {user} = useSelector((state) => state.user)
  const {hobbies} = useSelector(state => state.hobbies);
  const {tasks} = useSelector(state => state.tasks)
  const {events} = useSelector(state => state.events);
  const completedTasks = useSelector((state) => state.tasks.completedTasks);
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
    const [selectedImage, setSelectedImage] = useState(user.photoURL || 3 );
console.log(user);
const dispatch = useDispatch();

    const handleImageSelect = (imageNumber) => {
      setSelectedImage(imageNumber);
      setShowImageSelector(false);
      dispatch(updateUserProfile({ 
        uid: user.uid, 
        newName: user.displayName, 
        newImageNumber: imageNumber 
    }));


  }

  const handleHobbyClick = (refId) => {
    if (selectedHobby === refId) {
      setSelectedHobby(null); 
    } else {
      setSelectedHobby(refId); 
    }
  };

  function getWeeklyCommitments(hobbies, tasks) {

    const hobbyCommitments = hobbies.reduce((total, hobby) => {
      return total + (hobby.daysOfWeek ? hobby.daysOfWeek.length : 0);
    }, 0);
  
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
  const recentTasks = [...completedTasks]
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
const eventsCount = getUpcomingEventsCount(events);
const totalCommitments = getWeeklyCommitments(hobbies, tasks);

const onNameChange = (newName) => {
  // Dispatch the update to the Redux store and Firestore
  dispatch(updateUserProfile({ 
    uid: user.uid, 
    newName: newName, 
    newImageNumber: selectedImage 
}));

  setShowImageSelector(false);
}


  return (
    <div className="p-4 overflow-y-auto hide-scrollbar h-screen bg-gradient-to-t from-slate-100 via-whiten to-white dark:bg-black dark:from-transparent dark:to-transparent dark:via-transparent text-black dark:text-current">
      {/* Profile Picture and Bio */}
      <div className="text-center md:text-left mb-6 flex flex-col w-full items-center">
        <div className="flex justify-center md:justify-start relative px-12 ">
          <img
            src={`/profilepics/${selectedImage}.png`}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 border object-cover object-center "
          />
          <div 
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => setShowImageSelector(prev => !prev)}
      >
          <FaPencilAlt />
      </div>
           {showImageSelector && <ImageSelector onSelect={handleImageSelect} onClose={() => setShowImageSelector(false)} onNameChange={onNameChange} />}
        </div>
        <h2 className="text-2xl font-bold">{user.displayName}</h2>
        <p>Number of hobbies: {hobbies.length}</p>
        <p>weekly routine commitments: {totalCommitments}</p>
        <p>Upcoming events: {eventsCount}</p>
      </div>

      {/* Recent Activity and List of Hobbies */}
      <div className="flex flex-col items-center  space-y-4 text-center sm:space-y-0 sm:space-y-4 !overflow-y-auto hide-scrollbar h-full  ">
        {/* Recent Activity */}
        <div className="sm:w-1/2 bg-white dark:bg-boxdark rounded w-full shadow shadow-md">
    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
    {recentActivities.length === 0 ? (
        <div className="text-center my-6 px-4">
            <p className="text-lg font-semibold">No recent activity.</p>
            <p>Start practicing a hobby or completing tasks to see updates here!</p>
        </div>
    ) : (
        recentActivities.map((activity, index) => (
            <div key={index} className={`p-2 rounded mb-2 flex flex-col w-full items-center ${activity.item === 'hobby' ? 'border-green-400 border-l-4' : 'border-orange-400 border-l-4'}`}>
                <p className="text-sm text-gray-600">
                    {new Date(activity.item === 'hobby' ? activity.date : activity.completedDate).toLocaleDateString()}
                </p>
                {activity.item === 'hobby' ? (
                    <p>Practiced {activity.hobbyName} for {activity.timeSpent} minutes</p>
                ) : (
                    <p>Task completed: {activity.name}</p>
                )}
            </div>
        ))
    )}
</div>

        {/* List of Hobbies */}
        <div className="overflow-y-auto max-h-[400px] sm:max-h-[500px] sm:w-1/2 bg-white dark:bg-boxdark rounded hide-scrollbar w-full shadow shadow-md">
    <h2 className="text-xl font-bold mb-4">List of Hobbies</h2>
    {hobbies.length === 0 ? (
        <div className="text-center my-6">
            <p className="text-lg font-semibold">No hobbies added yet.</p>
            <p>Start by adding a hobby to track and monitor your progress!</p>
        </div>
    ) : (
        hobbies.map(hobby => (
            <div key={hobby.refId} className="mb-4">
                <div 
                    className="bg-gray-100 p-2 rounded mb-2 flex justify-between items-center cursor-pointer border-b"
                    onClick={() => handleHobbyClick(hobby.refId)}
                >
                    <span>{hobby.name}</span>
                    <span>{selectedHobby === hobby.refId ? '▲' : '▼'}</span> {/* Change arrow based on expansion */}
                </div>
                {selectedHobby === hobby.refId && <HobbyDetails hobby={hobby} />}
            </div>
        ))
    )}
</div>
      </div>
    </div>
  );
}

export default Page