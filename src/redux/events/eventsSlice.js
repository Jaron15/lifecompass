import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addEventToFirestore, getEventsFromFirestore, deleteEventFromFirestore, updateEventInFirestore  } from '../../utils/eventsBase';
import { userLoggedOut } from '../user/userSlice';
import { DUMMY_EVENTS } from '../../utils/demoData';
import {demoSlice} from '../demo/demoSlice';
import {generateDynamicEventDates} from '../../utils/demoData'

 
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
    const state = thunkAPI.getState();
    if (state.events.demo) {
      const mockId = `demo-event-id-${Date.now()}`;
      return { id: mockId, ...event, refId: mockId };
    } else {
    try {
      const addedEvent = await addEventToFirestore(userId, event);
      return addedEvent;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async ({userId, eventId}, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.events.demo) {
      return eventId;
    } else {
    try {
      await deleteEventFromFirestore(userId, eventId);
      return eventId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({userId, eventId, updatedEvent}, thunkAPI) => {
    const state = thunkAPI.getState();
    if (state.events.demo) {
      return {eventId, updatedEvent};
    } else {
    try {
      await updateEventInFirestore(userId, eventId, updatedEvent);
      return {eventId, updatedEvent};
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
}
);



export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    status: 'idle',
    error: null,
    demo: false
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase("persist/REHYDRATE", (state, action) => {
      if (!state.events) {
        state.events = [];
      }
    })
    .addCase(demoSlice.actions.toggleDemoMode, (state, action,) => {
      // Toggle the demo status in response to the toggleDemoMode action
      state.demo = !state.demo;
      if (state.demo) {
        const demoEventsWithDynamicDates = generateDynamicEventDates(DUMMY_EVENTS);
        state.events = demoEventsWithDynamicDates;

      } else {
        state.events = [],
        state.status='idle',
        state.error=null
      }
    })
    .addCase(userLoggedOut, (state) => {
      if (!state.demo) {
      return {
        events: [],
        status: 'idle',
        error: null,
      }
    }
    })
    //----------fetch------------
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
     //----------fetch------------
     //----------create------------
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
    //----------create------------
    //----------delete------------
    .addCase(deleteEvent.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(deleteEvent.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.events = state.events.filter(event => event.id !== action.payload);
    })
    .addCase(deleteEvent.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //----------delete------------
    //----------update------------
    .addCase(updateEvent.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(updateEvent.fulfilled, (state, action) => {
      state.status = 'succeeded';
      const index = state.events.findIndex(event => event.id === action.payload.eventId);
      if (index !== -1) {
        state.events[index] = {...state.events[index], ...action.payload.updatedEvent};
      }
    })
    .addCase(updateEvent.rejected, (state, action) => {
      state.status = "idle";
      if (action.payload) {
        state.error = action.payload.error;
      } else {
        state.error = action.error;
      }
    })
    //----------update------------
  },
});

export const { setEvents, clearError } = eventsSlice.actions;

export default eventsSlice.reducer;

