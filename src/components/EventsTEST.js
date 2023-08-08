import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEvent, fetchEvents, deleteEvent, updateEvent, clearError } from '../redux/events/eventsSlice';
import Modal from './Modal';

const EventsComponent = () => {
    const dispatch = useDispatch();

    const events = useSelector((state) => state.events.events);
    const { user } = useSelector((state) => state.user);
    const [editedEvent, setEditedEvent] = useState(null);


    const [newEvent, setNewEvent] = useState({
      name: '',
      date: '',
      time: '', 
      isRepeating: false, 
      details: { 
        description: '',
        location: '', 
        url: '' 
      },
      endDate: '',
      repeatsAnnually: false,
    });

    const handleAddEvent = () => {
        console.log(newEvent);
        dispatch(addEvent({userId: user.uid, event: newEvent}));
    };
    
    const handleDeleteEvent = (eventId) => {
        dispatch(deleteEvent({userId: user.uid, eventId}));
      };
      const handleUpdateEvent = () => {
        dispatch(updateEvent({userId: user.uid, eventId: editedEvent.id, updatedEvent: editedEvent}));
        setEditedEvent(null);
      };
      
      function displayDate(inputDate) {
        const date = new Date(inputDate);
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toLocaleDateString();
    }    
    function formatTime24To12(timeString) {
        const [hours, minutes] = timeString.split(':');
        let newHours = parseInt(hours, 10);
        const period = newHours >= 12 ? 'PM' : 'AM';
    
        if (newHours === 0) {
            newHours = 12;
        } else if (newHours > 12) {
            newHours -= 12;
        }
    
        return `${newHours}:${minutes} ${period}`;
    }
    
      
      const handleInputChange = (e, field, isDetail) => {
        if (editedEvent) {
          if (isDetail) {
            setEditedEvent(prev => ({
              ...prev,
              details: {
                ...prev.details,
                [field]: e.target.value
              }
            }));
          } else {
            setEditedEvent(prev => ({ ...prev, [field]: e.target.value }));
          }
        } else {
          // Handle inputs for the new event form
          if (isDetail) {
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
      }
      
      const [modalMessage, setModalMessage] = useState(null);
      const [isModalOpen, setModalOpen] = useState(false);
      const openModal = () => setModalOpen(true);
      const closeModal = () => setModalOpen(false);
      const handleClose = () => {
        closeModal();
        dispatch(clearError());
      };
      const { error } = useSelector((state) => state.events); 
    useEffect(() => {
        console.log(isModalOpen);
        if (error) {
          console.log(error);
          setModalMessage(error);
          openModal();
        }
    }, [events, error, isModalOpen]); 

    useEffect(() => {
        dispatch(fetchEvents(user.uid)); 
      }, [dispatch]);
    
    return (
      <div className="flex flex-col items-center justify-center">
         <div>

{isModalOpen && (
  <Modal
    isOpen={isModalOpen}
    onClose={handleClose}
    title="Error"
    message={modalMessage}
  />
)}

</div>
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
          placeholder="Event date"
        />
        <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="date"
          value={newEvent.endDate}
          onChange={(e) => handleInputChange(e, 'endDate')}
          placeholder="End date (optional)"
        />
        <input
          className="border-2 border-blue-500 rounded p-2 m-2"
          type="time"
          value={newEvent.time}
          onChange={(e) => handleInputChange(e, 'time')}
          placeholder="Event time"
        />
        <label>
          <input
            type="checkbox"
            checked={newEvent.repeatsAnnually}
            onChange={(e) =>
              setNewEvent({ ...newEvent, repeatsAnnually: e.target.checked })
            }
          />
          Repeats annually
        </label>
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
            const endDate = event.endDate;
            const time = event.time;
            const description = event.details.description;
            const location = event.details.location;
            const details = event.details.url;
            const repeatsAnnually = event.repeatsAnnually;
             return (
            <div className="border-2 border-blue-500 rounded p-2 m-2" key={event.id}>
              <h2>{name}</h2>
              <p>Date: {displayDate(date)} {endDate && `- ${displayDate(endDate)}`}</p>
              {time && <p>Time: {formatTime24To12(time)}</p>}
              {repeatsAnnually && <p>Repeats annually</p>}
              {event.details && 
                <div>
                  {description && <p>Description: {description}</p>}
                  {location && <p>Location: {location}</p>}
                  {details && <p>Relevant Link: {details}</p>}
                </div>
              }
              <button
                className="bg-red-500 text-white px-4 py-2 rounded m-2"
                onClick={() => handleDeleteEvent(event.id)}
                >
                Delete Event
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded m-2"
                onClick={() => setEditedEvent(event)}
                >
                Edit Event
                </button>
            </div>
          )})}
          {editedEvent && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
    <div className="bg-white p-5 rounded shadow-lg relative w-3/4">
      {/* Close button */}
      <button onClick={() => setEditedEvent(null)} className="absolute top-2 right-2">X</button>

      {/* Fields for editing */}
      <input
        className="border-2 border-blue-500 rounded p-2 m-2"
        type="text"
        value={editedEvent.name}
        onChange={(e) => handleInputChange(e, 'name')}
        placeholder="Event name"
      />
      <input
        className="border-2 border-blue-500 rounded p-2 m-2"
        type="date"
        value={editedEvent.date}
        onChange={(e) => handleInputChange(e, 'date')}
      />
      <input
        className="border-2 border-blue-500 rounded p-2 m-2"
        type="date"
        value={editedEvent.endDate}
        onChange={(e) => handleInputChange(e, 'endDate')}
      />
      <input
        className="border-2 border-blue-500 rounded p-2 m-2"
        type="time"
        value={editedEvent.time}
        onChange={(e) => handleInputChange(e, 'time')}
      />
      <input
        className="border-2 border-blue-500 rounded p-2 m-2"
        type="text"
        value={editedEvent.details.description}
        onChange={(e) => handleInputChange(e, 'description', true)}
        placeholder="Description"
      />
      <input
        className="border-2 border-blue-500 rounded p-2 m-2"
        type="text"
        value={editedEvent.details.location}
        onChange={(e) => handleInputChange(e, 'location', true)}
        placeholder="Location"
      />
      <input
        className="border-2 border-blue-500 rounded p-2 m-2"
        type="text"
        value={editedEvent.details.url}
        onChange={(e) => handleInputChange(e, 'url', true)}
        placeholder="Relevant Link"
      />
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded m-2"
        onClick={handleUpdateEvent}
      >
        Submit changes
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    );
};

export default EventsComponent;
