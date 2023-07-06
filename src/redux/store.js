import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/userSlice';
import hobbiesReducer from './hobbies/hobbiesSlice';
import eventsReducer from './events/eventsSlice';
import tasksReducer from './tasks/tasksSlice';

const rootReducer = combineReducers({
  user: userReducer,
  hobbies: hobbiesReducer,
  events: eventsReducer,
  tasks: tasksReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
