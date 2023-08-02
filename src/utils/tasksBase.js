
import { nanoid } from '@reduxjs/toolkit';
import {db} from './firebase'
import { doc, collection, getDocs, addDoc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore"; 

export async function getTasksFromFirestore(userId) {
    try {
        const tasks = [];
        const tasksSnapshot = await getDocs(collection(db, 'users', userId, 'tasks'));
        
        // Check if tasksSnapshot exists
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
      // Validate task data
      if (!task.name || !task.type) {
        throw new Error('Task name and type are required');
      }
  
      if (task.type === 'recurring' && !task.recurringDay) {
        throw new Error('Recurring tasks require a recurringDay property');
      }
  
      if (task.type === 'singular' && !task.dueDate) {
        throw new Error('Singular tasks require a dueDate property');
      }
  
      // Add id and isCompleted: false to every task
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

export const deleteTaskFromFirestore = async (userId, taskId) => {
    try {
      const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error('Error deleting task', error);
      throw error;
    }
  };
  
  export const markTaskAsCompletedInFirestore = async (userId, taskId, completedDate) => {
    try {
        const taskRef = doc(db, 'users', userId, 'tasks', taskId);
        console.log('userId:', userId);
        console.log('taskId:', taskId);
        const taskSnap = await getDoc(taskRef);
        
  
      if (taskSnap.exists()) {
        // Destructure the task data to separate id from other fields
        const { id, ...otherTaskData } = taskSnap.data();
  
        const completedTask = {
          ...otherTaskData,
          completedDate,
          isCompleted: true,
        };
  
        // Add to the 'completedTasks' collection without providing a specific id
        const completedTaskRef = await addDoc(collection(db, 'users', userId, 'completedTasks'), completedTask);
  
        // Delete the task from 'tasks' collection
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
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0];
  
      // Deconstruct the task to separate the id from the other fields
      const { id, ...otherFields } = task;
  
      const completedTask = {
        ...otherFields,
        isCompleted: true, 
        completedDate: dateString,
      };
  
      const userDoc = doc(db, 'users', userId);
      const completedTasksCollection = collection(userDoc, 'completedTasks');
  
      // Add the completedTask to Firestore without providing a specific id
      const completedTaskDoc = await addDoc(completedTasksCollection, completedTask);
  
      // Return the completed task with the new id
      return { ...completedTask, id: completedTaskDoc.id }; 
  
    } catch (error) {
      console.error('Error adding completed task to Firestore:', error);
      throw error;
    }
  };  
  
  export const deleteCompletedTaskFromFirestore = async (userId, taskId) => {
    try {
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
  }
  
  