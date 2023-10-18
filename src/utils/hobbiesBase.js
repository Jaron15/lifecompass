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
    
      const hobbies = snapshot.docs.map(doc => ({...doc.data(), refId: doc.id}));
    
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
const hobbyWithCreatedDate = {
  ...hobby,
  createdDate: new Date().toISOString().split('T')[0] 
};

    try {
      const docRef = await addDoc(hobbiesCollection, hobbyWithCreatedDate);
      
      const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', docRef.id);
        await updateDoc(hobbyDocRef, { refId: docRef.id });

        const newHobby = { ...hobbyWithCreatedDate, refId: docRef.id };

      
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
    const hobbyRef = doc(db, 'users', user.uid, 'hobbies', hobby.refId);
    
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
    return { logEntry: logEntryWithId };

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
  
  export async function addGoalToHobbyInFirestore(user, hobbyId, goal) {
    const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
    await updateDoc(hobbyDocRef, {
      goals: arrayUnion(goal),
    });
  }

  export async function removeGoalFromHobbyInFirestore(user, hobbyId, goalId) {
    const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
    
    // Fetch the current hobby document
    const hobbySnapshot = await getDoc(hobbyDocRef);
    if (!hobbySnapshot.exists()) {
        throw new Error("Hobby not found");
    }

    const hobbyData = hobbySnapshot.data();
    const updatedGoals = hobbyData.goals.filter(goal => goal.id !== goalId);

    // Update the hobby document with the modified goals array
    await updateDoc(hobbyDocRef, {
        goals: updatedGoals
    });
}


export async function updateGoalInHobbyInFirestore(user, hobbyId, updatedGoal) {
  const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
  
  // Fetch the current hobby document
  const hobbySnapshot = await getDoc(hobbyDocRef);
  if (!hobbySnapshot.exists()) {
      throw new Error("Hobby not found");
  }

  const hobbyData = hobbySnapshot.data();
  const goals = hobbyData.goals || [];

  // Find the index of the goal to be updated
  const goalIndex = goals.findIndex(goal => goal.id === updatedGoal.id);

  if (goalIndex === -1) {
      throw new Error("Goal not found");
  }

  // Replace the old goal with the updated one
  goals[goalIndex] = updatedGoal;

  // Update the hobby document with the modified goals array
  await updateDoc(hobbyDocRef, {
      goals: goals
  });
}
  
export async function addNoteToFirestore(user, hobbyId, note) {
  const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
  
  if (typeof note.header !== 'string' || typeof note.body !== 'string') {
      throw new Error('Note validation failed');
  }

  await updateDoc(hobbyDocRef, {
      notes: arrayUnion(note),
  });

  return note;
}

export async function updateNoteInFirestore(user, hobbyId, noteId, updatedNote) {
  const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
  
  const hobbySnapshot = await getDoc(hobbyDocRef);
  if (!hobbySnapshot.exists()) {
    throw new Error("Hobby not found");
  }
  
  const hobbyData = hobbySnapshot.data();
  const notes = hobbyData.notes || [];
  
  const noteIndex = notes.findIndex(note => note.id === noteId);
  
  if (noteIndex === -1) {
    throw new Error("Note not found");
  }
  notes[noteIndex] = updatedNote;

  await updateDoc(hobbyDocRef, {
      notes: notes
  });
}

export async function deleteNoteFromFirestore(user, hobbyId, noteId) {
  const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
  
  const hobbySnapshot = await getDoc(hobbyDocRef);
  if (!hobbySnapshot.exists()) {
      throw new Error("Hobby not found");
  }

  const hobbyData = hobbySnapshot.data();
  const updatedNotes = hobbyData.notes.filter(note => note.id !== noteId);

  await updateDoc(hobbyDocRef, {
      notes: updatedNotes
  });
}

  
  