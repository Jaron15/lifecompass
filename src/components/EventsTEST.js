import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEvent, fetchEvents } from '../redux/events/eventsSlice';

const EventsComponent = () => {
    const dispatch = useDispatch();

    const events = useSelector((state) => state.events.events);
    const { user } = useSelector((state) => state.user);
    
    const [newEvent, setNewEvent] = useState({
      name: '',
      date: '',
      time: '', 
      isRepeating: false, 
      details: { 
        description: '',
        location: '', 
        url: '' 
      }
    });

    const handleAddEvent = () => {
        console.log(newEvent);
        dispatch(addEvent({userId: user.uid, event: newEvent}));
    };

    const handleInputChange = (e, field, isDetail) => {
      if(isDetail){
        setNewEvent({
          ...newEvent,
          details: {
            ...newEvent.details,
            [field]: e.target.value
          }
        });
      } else {
        setNewEvent({
          ...newEvent,
          [field]: e.target.value
        });
      }
    }

    useEffect(() => {
        dispatch(fetchEvents(user.uid)); 
      }, [dispatch]);
    
    return (
      <div className="flex flex-col items-center justify-center">
        <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="text"
          value={newEvent.name}
          onChange={(e) => handleInputChange(e, 'name')}
          placeholder="Event name"
        />
        <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="date"
          value={newEvent.date}
          onChange={(e) => handleInputChange(e, 'date')}
        />
         <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="time"
          value={newEvent.time}
          onChange={(e) => handleInputChange(e, 'time')}
        />
        <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="text"
          value={newEvent.details.description}
          onChange={(e) => handleInputChange(e, 'description', true)}
          placeholder="Description"
        />
        <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="text"
          value={newEvent.details.location}
          onChange={(e) => handleInputChange(e, 'location', true)}
          placeholder="Location"
        />
        <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="text"
          value={newEvent.details.url}
          onChange={(e) => handleInputChange(e, 'url', true)}
          placeholder="Relevant Link"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded m-2"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
        <div>
          {events.map((event) => {
            const name = event.name;
            const date = event.date;
            const time = event.time;
            const description = event.details.description;
            const location = event.details.location;
            const details = event.details.url;
             return (
            <div className="border-2 border-blue-500 rounded p-2 m-2" key={event.id}>
              <h2>{event.name}</h2>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              {time && <p>Time: {time}</p>}
              {event.details && 
                <div>
                  {description && <p>Description: {description}</p>}
                  {location && <p>Location: {location}</p>}
                  {details && <p>Relevant Link: {details}</p>}
                </div>
              }
            </div>
          )})}
        </div>
      </div>
    );
};

export default EventsComponent;
