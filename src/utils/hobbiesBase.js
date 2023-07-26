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
      throw error;  // Re-throw the error so it can be handled upstream
    }
  }
  
  export async function addHobbyToFirestore(user, hobby) {
    const hobbiesCollection = getUserHobbiesCollection(user);
    try {
      const docRef = await addDoc(hobbiesCollection, hobby);
      
      const newHobby = { ...hobby, firestoreId: docRef.id };
      
      return { user, newHobby };
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
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
    throw error;
  }
}

  
export async function updateHobbyInFirestore(user, hobby) {
    const hobbyRef = doc(db, 'users', user.uid, 'hobbies', hobby.firestoreId);
    
    const hobbySnapshot = await getDoc(hobbyRef);
    if (!hobbySnapshot.exists()) {
      throw new Error("No hobby found with this ID");
    }
  
    try {
      await updateDoc(hobbyRef, hobby);
    } catch (error) {
      console.error('Error updating hobby: ', error);
      throw error;
    }
  }
  
  export async function logPracticeInFirestore(user, hobbyId, logEntry) {
    const hobbyDocRef = doc(db, 'users', user.uid, 'hobbies', hobbyId);
    
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
    throw error; 
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
  
  
  
  