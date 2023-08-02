
import { nanoid } from '@reduxjs/toolkit';
import {db} from './firebase'
import { doc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore"; 

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
    console.log(userId);
    console.log(task);
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
      console.log(taskRef.id, '---RIGHT HERE---');

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
      const completedTask = {
        taskId,
        completedDate
      };
  
      const completedTaskRef = await addDoc(collection(db, 'users', userId, 'completedTasks'), completedTask);

      return { id: completedTaskRef.id, ...completedTask };
    } catch (error) {
      console.error('Error marking task as completed', error);
      throw error;
    }
  };

  export const addCompletedTaskToFirestore = async(userId, task) => {
    const userDoc = doc(db, 'users', userId);
    const completedTasksCollection = collection(userDoc, 'completedTasks');
    const taskDoc = doc(completedTasksCollection, task.id);
  
    await setDoc(taskDoc, task);
  }
  
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
  
  