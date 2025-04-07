import { createSlice } from "@reduxjs/toolkit";

export const entriesSlice = createSlice({
  name: "Entries",
  initialState: null,
  reducers: {
    setEntries: (state, action) => {
      return { ...state, ...action.payload.entries };
    },
    setDailyAchieved: (state, action) => {
      return { ...state, daily_achieved: action.payload.daily };
    },
    setWeeklyAchieved: (state, action) => {
      return { ...state, weekly_achieved: action.payload.weekly };
    },
    setYearlyAchieved: (state, action) => {
      return { ...state, yearly_achieved: action.payload.yearly };
    },
    resetEntries: (state, action) => {
      return null;
    },
  },
});

// Export all actions
export const {
  setEntries,
  setDailyAchieved,
  setWeeklyAchieved,
  setYearlyAchieved,
  resetEntries,
} = entriesSlice.actions;

export default entriesSlice.reducer;
