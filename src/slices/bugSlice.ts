import { bugs } from "@/temporary-state/bugs";
import { createSlice } from "@reduxjs/toolkit";

const bugSlice = createSlice({
  name: "bugs",
  initialState:bugs,
  reducers: {
    addBug: (state, action) => {
      state.push(action.payload);
    },
    updateBug: (state, action) => {
      const index = state.findIndex(b => b.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteBug: (state, action) => {
      return state.filter(bug => bug.id !== action.payload);
    },
  },
});

export const { addBug, updateBug, deleteBug } = bugSlice.actions;
export default bugSlice.reducer;
