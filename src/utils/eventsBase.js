import { doc, getDocs, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase'; 

export const getEventsFromFirestore = async (userId) => {
  try {
    const eventCollection = collection(db, 'users', userId, 'events');
    const eventSnapshot = await getDocs(eventCollection);
    const events = eventSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
console.log(events);
    return events;
  } catch (error) {
    console.error('Error getting events from Firestore:', error);
    throw error;
  }
};

export const addEventToFirestore = async (userId, event) => {
  try {

    if (typeof event.name !== 'string' || event.name.trim() === '') {
      throw new Error('Event name and date are required');
    }
    if (!event.date) {
      throw new Error('Event date can not be empty');
    }

      if (event.time && typeof event.time !== 'string') {
        throw new Error('Event time must be a string');
      }
      if (event.details && typeof event.details !== 'object') {
        throw new Error('Event details must be an object');
      }
   
      const eventCollection = collection(db, 'users', userId, 'events');
      const eventDoc = await addDoc(eventCollection, event);
  
      return { id: eventDoc.id, ...event };
  } catch (error) {
    console.error('Error adding event to Firestore:', error);
    throw error;
  }
};

export const deleteEventFromFirestore = async (userId, eventId) => {
  try {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Could not find event');
    }
    const eventDoc = doc(db, 'users', userId, 'events', eventId);
    await deleteDoc(eventDoc);
  } catch (error) {
    console.error('Error deleting event from Firestore:', error);
    throw error;
  }
};

