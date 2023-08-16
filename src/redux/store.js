import { configureStore, getDefaultMiddleware  } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/userSlice';
import hobbiesReducer from './hobbies/hobbiesSlice';
import eventsReducer from './events/eventsSlice';
import tasksReducer from './tasks/tasksSlice';
import demoReducer from './demo/demoSlice'; 

const rootReducer = combineReducers({
  user: userReducer,
  hobbies: hobbiesReducer,
  events: eventsReducer,
  tasks: tasksReducer,
  demo: demoReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['hobbies', 'user', 'demo']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),

});

export const persistor = persistStore(store);
export default store;
