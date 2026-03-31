import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import entriesSlice from "./features/entriesSlice";
import chatSlice from "./features/chatSlice";
import gamificationSlice from "./features/gamificationSlice";
import moduleSlice from "./features/moduleSlice";

export const store = configureStore({
  reducer: {
    User: userReducer,
    Module: moduleSlice,
    Entries: entriesSlice,
    Chat: chatSlice,
    Gamification: gamificationSlice,
  },
});
