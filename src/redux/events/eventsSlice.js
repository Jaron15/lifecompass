import { createSlice, nanoid } from '@reduxjs/toolkit'

const eventsSlice = createSlice({
  name: 'events',
  initialState: [],
  reducers: {
    createEvent: (state, action) => {
      state.push({
        id: nanoid(),
        eventName: action.payload.eventName,
        eventTime: action.payload.eventTime,
        eventDate: action.payload.eventDate
      })
    },
    updateEvent: (state, action) => {
      const index = state.findIndex(event => event.id === action.payload.id)
      if (index !== -1) {
        if (action.payload.eventName !== undefined) {
          state[index].eventName = action.payload.eventName;
        }
        if (action.payload.eventTime !== undefined) {
          state[index].eventTime = action.payload.eventTime;
        }
        if (action.payload.eventDate !== undefined) {
          state[index].eventDate = action.payload.eventDate;
        }
      }
    },
    deleteEvent: (state, action) => {
      const index = state.findIndex(event => event.id === action.payload)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
  },
})

export const { createEvent, updateEvent, deleteEvent } = eventsSlice.actions

export default eventsSlice.reducer
