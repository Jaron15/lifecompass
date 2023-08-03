import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addEventToFirestore, getEventsFromFirestore } from '../../utils/eventsBase';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (userId, thunkAPI) => {
    try {
      const events = await getEventsFromFirestore(userId);
      return events;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async ({userId, event}, thunkAPI) => {
    try {
      const addedEvent = await addEventToFirestore(userId, event);
      return addedEvent;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase("persist/REHYDRATE", (state, action) => {
      if (!state.events) {
        state.hobbies = [];
      }
    })
    .addCase(fetchEvents.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchEvents.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.events = action.payload;
    })
    .addCase(fetchEvents.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    .addCase(addEvent.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(addEvent.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.events.push(action.payload);
    })
    .addCase(addEvent.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
  },
});

export default eventsSlice.reducer;

