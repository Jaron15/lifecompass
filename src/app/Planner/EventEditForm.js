import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEvent } from '../../redux/events/eventsSlice';

const EditEventForm = ({ item, onClose }) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [eventFormData, setEventFormData] = useState(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['description', 'location', 'url'].includes(name)) {
            setEventFormData(prevState => ({
                ...prevState,
                details: {
                    ...prevState.details,
                    [name]: value
                }
            }));
        } else {
            setEventFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const isSubmitEnabled = eventFormData.name.trim() !== "" && eventFormData.date.trim() !== "";  

    const eventUpdate = async (event) => {
        event.preventDefault();
        try {
            dispatch(updateEvent({ userId: user.uid, eventId: eventFormData.refId, updatedEvent: eventFormData }));
            console.log("Event updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const eventDuration = eventFormData.endDate ? 'multi' : 'single';
    
    return (
        <div className="bg-gray-100 p-4 rounded-md h-full overflow-scroll overflow-x-clip w-full hide-scrollbar z-50 ">
            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="name">Event Name:</label>
                <input 
                    type="text" 
                    id="name"
                    name="name" 
                    value={eventFormData.name} 
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="date">Date:</label>
                <input 
                    type="date" 
                    id="date"
                    name="date"
                    value={eventFormData.date}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {eventDuration === 'multi' && (
                <div className="mb-4">
                    <label className="block text-black dark:text-white font-bold mb-2" htmlFor="endDate">End Date:</label>
                    <input 
                        type="date" 
                        id="endDate"
                        name="endDate"
                        value={eventFormData.endDate}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="time">Time:</label>
                <input 
                    type="time" 
                    id="time"
                    name="time"
                    value={eventFormData.time}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="description">Description:</label>
                <textarea 
                    id="description"
                    name="description"
                    value={eventFormData.details.description}
                    onChange={handleChange}
                    rows="4"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
            </div>

            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="location">Location:</label>
                <input 
                    type="text" 
                    id="location"
                    name="location"
                    value={eventFormData.details.location}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="url">URL:</label>
                <input 
                    type="url" 
                    id="url"
                    name="url"
                    value={eventFormData.details.url}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-black dark:text-white font-bold mb-2" htmlFor="isRepeating">Repeats:</label>
                <select 
                    id="isRepeating"
                    value={eventFormData.isRepeating}
                    onChange={handleChange}
                    name="isRepeating"
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-black"
                >
                    <option value="">Does not repeat</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                </select>
            </div>
            <div className='flex flex-row  '>
            <button 
                onClick={eventUpdate}
                className={`block w-1/2 max-w-xs mx-1 bg-primary hover:bg-highlight dark:bg-highlight dark:hover:primary focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold disabled:opacity-25 ${!isSubmitEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Update
            </button>
            <button 
                onClick={onClose}
                className={`block w-1/2 max-w-xs mx-1 bg-red-500 hover:bg-highlight dark:bg-red-500 dark:hover:primary focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold `}
            >
                Cancel
            </button>
            </div>
        </div>
    );
}

export default EditEventForm;
