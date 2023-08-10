import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent } from '../../redux/events/eventsSlice';

const EventForm = ({ closeAddForm }) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [eventFormData, setEventFormData] = useState({
        name: '',
        date: '',
        endDate: '',
        time: '',
        details: {
            description: '',
            location: '',
            url: ''
        },
        isRepeating: '' 
    });

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

    const eventSubmit = async (event) => {
        event.preventDefault();
        const eventData = {
            ...eventFormData
        };
        try {
            await dispatch(addEvent({ userId: user.uid, event: eventData }));
            console.log("Event added successfully!");
            setEventFormData({
                name: '',
                date: '',
                endDate: '',
                time: '',
                details: {
                    description: '',
                    location: '',
                    url: ''
                },
                isRepeating: ''
            });
            closeAddForm();
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-md max-h-[32rem] overflow-scroll w-full">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Event Name:</label>
                <input 
                    type="text" 
                    id="name"
                    name="name" 
                    value={eventFormData.name} 
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="date">Start Date:</label>
                <input 
                    type="date" 
                    id="date"
                    name="date"
                    value={eventFormData.date}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="endDate">End Date:</label>
                <input 
                    type="date" 
                    id="endDate"
                    name="endDate"
                    value={eventFormData.endDate}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="time">Time:</label>
                <input 
                    type="time" 
                    id="time"
                    name="time"
                    value={eventFormData.time}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="description">Description:</label>
                <textarea 
                    id="description"
                    name="description"
                    value={eventFormData.details.description}
                    onChange={handleChange}
                    rows="4"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="location">Location:</label>
                <input 
                    type="text" 
                    id="location"
                    name="location"
                    value={eventFormData.details.location}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="url">URL:</label>
                <input 
                    type="url" 
                    id="url"
                    name="url"
                    value={eventFormData.details.url}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="isRepeating">Repeats:</label>
                <select 
                    id="isRepeating"
                    value={eventFormData.isRepeating}
                    onChange={handleChange}
                    name="isRepeating"
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Does not repeat</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                </select>
            </div>
            <button 
                onClick={eventSubmit}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!isSubmitEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Submit
            </button>
        </div>
    );
}

export default EventForm;
