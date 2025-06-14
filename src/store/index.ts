import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/slices/userSlice";
import taskReducer from "@/slices/taskSlice";
import bugReducer from "@/slices/bugSlice";
import updateReducer from "@/slices/updateSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    bugs: bugReducer,
    updates: updateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
