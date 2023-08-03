import {db} from './firebase'
import { doc, collection, getDocs, addDoc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore"; 

export async function getTasksFromFirestore(userId) {
    try {
        const tasks = [];
        const tasksSnapshot = await getDocs(collection(db, 'users', userId, 'tasks'));
        
        if (!tasksSnapshot.empty) {
            tasksSnapshot.forEach((doc) => {
              tasks.push({ id: doc.id, ...doc.data() });
            });
        }

        return tasks;
    } catch (error) {
        console.error('Error fetching tasks', error);
        throw error;
    }
};



export const addTaskToFirestore = async (userId, task) => {
    try {
      if (!task.name || !task.type) {
        throw new Error('Task name and type are required');
      }
  
      if (task.type === 'recurring' && !task.recurringDay) {
        throw new Error('Recurring tasks require a recurringDay property');
      }
  
      if (task.type === 'singular' && !task.dueDate) {
        throw new Error('Singular tasks require a dueDate property');
      }
  
      
      const taskData = {
        ...task,
        isCompleted: false
      };
  
      const taskRef = await addDoc(collection(db, 'users', userId, 'tasks'), taskData);

    return { id: taskRef.id, ...taskData };
  } catch (error) {
    console.error('Error adding task', error);
    throw error;
  }
};


export const updateTaskInFirestore = async (userId, taskId, updatedTask) => {
  try {
    if (!updatedTask.name) {
        throw new Error('Task name cannot be empty');
      }
    if (!userId || !taskId) {
        throw new Error('Invalid user or task ID');
      }
  
      if (typeof updatedTask !== 'object' || updatedTask === null) {
        throw new Error('Updated task must be a valid object');
      }
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskRef, updatedTask);
  } catch (error) {
    console.error('Error updating task in Firestore:', error);
    if (error.message === 'No document to update: missing') {
        throw new Error('The task you are trying to update does not exist');
      }
  
    throw error;
  }
};

export const updateCompletedTaskInFirestore = async (userId, taskId, updatedFields) => {
    try {
        if (!userId || !taskId) {
            throw new Error('Invalid user or completed task ID');
          }
      
          if (typeof updatedFields !== 'object' || updatedFields === null) {
            throw new Error('Updated fields must be a valid object');
          }
      const taskRef = doc(db, 'users', userId, 'completedTasks', taskId);
      const taskSnap = await getDoc(taskRef);
  
      if (taskSnap.exists()) {
        const taskData = taskSnap.data();
        const updatedTask = {
          ...taskData,
          ...updatedFields,
        };
  
        await updateDoc(taskRef, updatedTask);
  
        return { id: taskId, ...updatedTask };
      } else {
        throw new Error('The completed task you are trying to update does not exist');
      }
    } catch (error) {
      console.error('Error updating completed task', error);
      throw error;
    }
  };
  


export const deleteTaskFromFirestore = async (userId, taskId) => {
    try {
        if (!userId) {
            throw new Error('Invalid or missing user ID');
          }
          if (!taskId) {
            throw new Error('Invalid or missing task ID');
          }
      const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error('Error deleting task', error);
      throw error;
    }
  };
  
  export const markTaskAsCompletedInFirestore = async (userId, taskId, completedDate) => {
    try {
        if (!userId) {
            throw new Error('Invalid or missing user ID');
          }
          if (!taskId) {
            throw new Error('Invalid or missing task ID');
          }
          if (!completedDate || isNaN(Date.parse(completedDate))) {
            throw new Error('Invalid or missing completed date');
          }
        const taskRef = doc(db, 'users', userId, 'tasks', taskId);
        const taskSnap = await getDoc(taskRef);
        
  
      if (taskSnap.exists()) {
     
        const { id, ...otherTaskData } = taskSnap.data();
  
        const completedTask = {
          ...otherTaskData,
          completedDate,
          isCompleted: true,
        };
  
        const completedTaskRef = await addDoc(collection(db, 'users', userId, 'completedTasks'), completedTask);

        await deleteDoc(taskRef);
  
        return { id: completedTaskRef.id, ...completedTask };
      } else {
        throw new Error('Task not found');
      }
  
    } catch (error) {
      console.error('Error marking task as completed', error);
      throw error;
    }
  };
  
export const addCompletedTaskToFirestore = async (userId, task) => {
    try {
        if (!userId) {
            throw new Error('Invalid or missing user ID');
          }
          if (!task || typeof task !== 'object' || !task.id) {
            throw new Error('Invalid or missing task data');
          }
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0];
  
      const { id, ...otherFields } = task;
  
      const completedTask = {
        ...otherFields,
        isCompleted: true, 
        completedDate: dateString,
      };
  
      const userDoc = doc(db, 'users', userId);
      const completedTasksCollection = collection(userDoc, 'completedTasks');
  
      const completedTaskDoc = await addDoc(completedTasksCollection, completedTask);

      return { ...completedTask, id: completedTaskDoc.id }; 
  
    } catch (error) {
      console.error('Error adding completed task to Firestore:', error);
      throw error;
    }
  };  
  
  export const deleteCompletedTaskFromFirestore = async (userId, taskId) => {
    try {
        if (!userId) {
            throw new Error('Invalid or missing user ID');
          }
          if (!taskId) {
            throw new Error('Invalid or missing task ID');
          }
      const taskRef = doc(db, 'users', userId, 'completedTasks', taskId);
      console.log(taskRef);
      await deleteDoc(taskRef);
      console.log(`Task with ID ${taskId} deleted from Firestore`);

    } catch (error) {
      console.error('Error deleting completed task', error);
      throw error;
    }
  };
  
  
  export const getCompletedTasksFromFirestore = async(userId) => {
    try {
        if (!userId) {
          throw new Error('Invalid or missing user ID');
        }
    
        const userDoc = doc(db, 'users', userId);
        const completedTasksCollection = collection(userDoc, 'completedTasks');
    
        const completedTasksSnapshot = await getDocs(completedTasksCollection);
    
        const completedTasks = [];
        completedTasksSnapshot.forEach((doc) => {
          const taskData = doc.data();
          taskData.id = doc.id;
          completedTasks.push(taskData);
        });
    
        return completedTasks;
      } catch (error) {
        console.error('Error retrieving completed tasks from Firestore:', error);
        throw error;
      }
    };
    
  
  