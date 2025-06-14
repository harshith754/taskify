import { updates } from "@/temporary-state/updates";
import { createSlice } from "@reduxjs/toolkit";


const updateSlice = createSlice({
  name: "updates",
  initialState:updates,
  reducers: {
    addUpdate: (state, action) => {
      state.push(action.payload);
    },
    clearUpdates: () => [],
  },
});

export const { addUpdate, clearUpdates } = updateSlice.actions;
export default updateSlice.reducer;
