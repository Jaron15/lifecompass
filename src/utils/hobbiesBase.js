import { addDoc, getDocs, collection, deleteDoc, doc, updateDoc, getDoc, arrayUnion, setDoc } from "firebase/firestore";
import {db} from './firebase'
//-----------hobbies firebase functions-----------
export function getUserHobbiesCollection(user) {
    return collection(db, 'users', user.uid, 'hobbies');
  }
  
  export async function getHobbiesFromFirestore(userId) {
    try {
      const hobbiesCollection = getUserHobbiesCollection(userId);

      const snapshot = await getDocs(hobbiesCollection);
    
      // Transform the snapshot to an array of hobbies for data handling
      const hobbies = snapshot.docs.map(doc => ({...doc.data(), firestoreId: doc.id}));
    
      return hobbies;
    } catch (error) {
      console.error('Error getting hobbies from Firestore:', error);
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        throw new Error('Network error occurred, please check your connection and try again');
    } else {
      throw error;
      }  
    }
  }
  
  export async function addHobbyToFirestore(user, hobby) {
    const hobbiesCollection = getUserHobbiesCollection(user);
// data validation
    if (!Array.isArray(hobby.daysOfWeek) || typeof hobby.name !== 'string' || 
    !Array.isArray(hobby.practiceLog) || typeof hobby.practiceTimeGoal !== 'number' || hobby.practiceTimeGoal < 0 || hobby.name === '') {
  throw new Error('Hobby validation failed');
}

    try {
      const docRef = await addDoc(hobbiesCollection, hobby);
      
      const newHobby = { ...hobby, firestoreId: docRef.id };
      
      return { user, newHobby };
    } catch (error) {
      console.error("Error adding document: ", error);
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        throw new Error('Network error occurred, please check your connection and try again');
    } else {
      throw error;
      }  
    }
  }
  
  export async function deleteHobbyFromFirestore(user, hobbyId) {
    const selectedHobby = doc(db, 'users', user.uid, 'hobbies', hobbyId);
  
  const hobbySnapshot = await getDoc(selectedHobby);
  if (!hobbySnapshot.exists()) {
    throw new Error("Hobby not found");  
  }

  try {
    await deleteDoc(selectedHobby);
  } catch (error) {
    console.error('Error deleting hobby: ', error);
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        throw new Error('Network error occurred, please check your connection and try again');
    } else {
      throw error;
      }  
  }
}

  
export async function updateHobbyInFirestore(user, hobby) {
    const hobbyRef = doc(db, 'users', user.uid, 'hobbies', hobby.firestoreId);
    
    const hobbySnapshot = await getDoc(hobbyRef);
    if (!hobbySnapshot.exists()) {
      throw new Error("No hobby found with this ID");
    }
  
    // Validation
    if (typeof hobby.name !== 'string' || 
    !Array.isArray(hobby.daysOfWeek) || 
    !Array.isArray(hobby.practiceLog) || 
    typeof hobby.practiceTimeGoal !== 'number' || hobby.practiceTimeGoal <= 0) {
    throw new Error("Invalid hobby object");
    }
    
    if (hobbyRef === hobby) {
        throw new Error('No change identified')
    }
    try {
      await updateDoc(hobbyRef, hobby);
    } catch (error) {
      console.error('Error updating hobby: ', error);
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        throw new Error('Network error occurred, please check your connection and try again');
    } else {
      throw error;
      }  
    }
  }
  
  export async function logPracticeInFirestore(user, hobbyId, logEntry) {
    const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);

    // Validate logEntry
  if (typeof logEntry.date !== 'string' || !logEntry.date) {
    throw new Error('Invalid or missing log entry date');
  }
  
  if (typeof logEntry.timeSpent !== 'number' || !logEntry.timeSpent) {
    throw new Error('Invalid or missing log entry time spent');
  }


    
    // Generate unique logEntryId
    const logEntryId = Date.now().toString();
    
    // Attach the ID
    const logEntryWithId = { ...logEntry, id: logEntryId };
  
    const hobbyDocSnap = await getDoc(hobbyDocRef);
  if (!hobbyDocSnap.exists()) {
    console.error(`No such document! ID: ${hobbyId}`);
    throw new Error(`No hobby found with this ID`);
  }
    
  try {
    await updateDoc(hobbyDocRef, {
      practiceLog: arrayUnion(logEntryWithId),
    });
  
    // Return logEntryWithId for Redux to use
    return logEntryWithId;
  } catch (error) {
    console.error('Error adding practice log to hobby in Firestore:', error);
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        throw new Error('Network error occurred, please check your connection and try again');
    } else {
      throw error;
      }  
  }
}
  
  export async function deletePracticeLogFromFirestore(user, hobbyId, logEntryId) {
    const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
    const hobbyDocSnap = await getDoc(hobbyDocRef);
    
    if (hobbyDocSnap.exists()) {
      let hobby = hobbyDocSnap.data();
      const logIndex = hobby.practiceLog.findIndex(logEntry => logEntry.id === logEntryId);
      if(logIndex === -1) {
        throw new Error(`Log entry not found!`);
      }
      hobby.practiceLog = hobby.practiceLog.filter(logEntry => logEntry.id !== logEntryId);
      await updateDoc(hobbyDocRef, hobby);
    } else {
      throw new Error(`No hobby found with this ID`);
    }
  }
  
  export async function updatePracticeLogInFirestore(user, hobbyId, logEntryId, newLogEntry) {
    const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);

    if (typeof newLogEntry.date !== 'string' || !newLogEntry.date) {
        throw new Error('Invalid or missing log entry date');
      }
      
      if (typeof newLogEntry.timeSpent !== 'number' || !newLogEntry.timeSpent) {
        throw new Error('Invalid or missing log entry time spent');
      }

    const hobbySnap = await getDoc(hobbyDocRef);
  
    if (hobbySnap.exists()) {
      const hobbyData = hobbySnap.data();
      const logIndex = hobbyData.practiceLog.findIndex(log => log.id === logEntryId);
  
      if (logIndex !== -1) {
        const updatedLogEntry = {...hobbyData.practiceLog[logIndex], ...newLogEntry};
        hobbyData.practiceLog[logIndex] = updatedLogEntry;
            
        await setDoc(hobbyDocRef, hobbyData);
        return { hobbyId, logEntryId, updatedLog: updatedLogEntry };
      } else {
        console.error(`No such log entry! ID: ${logEntryId}`);
        throw new Error(`Log entry not found!`);
      }
    } else {
      console.error(`No hobby found with this ID`);
      throw new Error(`No hobby found with this ID`);
    }
  }
  
  
  
  