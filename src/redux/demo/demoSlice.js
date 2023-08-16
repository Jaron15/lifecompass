import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux'; 

export const demoSlice = createSlice({
  name: 'demo',
  initialState: {
    enabled: false,
  },
  reducers: {
    toggleDemoMode: (state) => {
        state.enabled = !state.enabled;
      },
  
  },
});

export const { toggleDemoMode } = demoSlice.actions;

export default demoSlice.reducer;
