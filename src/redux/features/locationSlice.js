import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
  name: "Location",
  initialState: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  },
  reducers: {
    setCurrentCoordinates: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetCurrentCoordinates: () => {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
    },
  },
});

// Export all actions
export const { setCurrentCoordinates, resetCurrentCoordinates } =
  locationSlice.actions;

export default locationSlice.reducer;
