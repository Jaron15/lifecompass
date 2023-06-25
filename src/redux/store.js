import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './tasks/tasksSlice'
import hobbiesReducer from './hobbies/hobbiesSlice'
import eventsReducer from './events/eventsSlice'
import userReducer from './user/userSlice'

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    hobbies: hobbiesReducer,
    events: eventsReducer,
    user: userReducer
  },
})
