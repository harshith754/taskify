import { tasks } from "@/temporary-state/tasks";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: tasks,
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
    startTracking: (state, action: PayloadAction<string>) => {
      const task = state.find((t) => t.id === action.payload);
      if (task && !task.isTracking) {
        task.isTracking = true;
        task.trackingStartedAt = Date.now();
      }
    },
    stopTracking: (state, action: PayloadAction<string>) => {
      const task = state.find((t) => t.id === action.payload);
      if (task && task.isTracking && task.trackingStartedAt) {
        const duration = Math.floor(
          (Date.now() - new Date(task.trackingStartedAt).getTime()) / 60000
        );
        task.timeSpent += duration;
        task.isTracking = false;
        task.trackingStartedAt = undefined;
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, startTracking, stopTracking } =
  taskSlice.actions;
export default taskSlice.reducer;
