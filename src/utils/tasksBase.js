import { getFirestore, doc, getDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { nanoid } from '@reduxjs/toolkit';
import {db} from './firebase'

export async function getTasksFromFirestore(user) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
        return userDocSnap.data().tasks || [];
    } else {
        console.error(`No user found found for ID: ${user.uid}`);
        return [];
    }
}

export async function addTaskToFirestore(user,task) {
    const userDocRef = doc(db, 'users', user.uid);
    const taskId = nanoid();
    const newTask = {id: taskId, ...task};

    await setDoc(userDocRef, {tasks: arrayUnion(newTask)}, {merge: true})

    return newTask;
}

export async function deleteTaskFromFirestore(user,taskId) {
    const userDocRef = doc(db, 'users', user.uid);

    await setDoc(userDocRef, {tasks: arrayRemove({id: taskId})}, {merge: true});

    return taskId
}

export async function completeTaskInFirestore(user, taskId) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const tasks = userDocSnap.data().tasks;
        const taskIndex = tasks.findIndex(task => task.id === taskId)

        if (taskIndex !== -1) {
            tasks[taskIndex].isCompleted = true;

            await setDoc(userDocRef, {tasks}, {merge: true });

            return tasks[taskIndex];
        } else { 
            console.error(`No such task! ID: ${taskId}`);
            throw new Error('Task not found!')
        }
    } else {
        console.error(`No user found for ID: ${user.uid}`);
        throw new Error('User not found!')
    }
}