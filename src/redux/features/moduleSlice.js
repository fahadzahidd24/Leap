import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const ACTIVE_MODULE_STORAGE_KEY = "activeModule";

const initialState = {
  selectedModule: null,
};

const persistSelectedModule = async (selectedModule) => {
  if (selectedModule) {
    await AsyncStorage.setItem(ACTIVE_MODULE_STORAGE_KEY, selectedModule);
    return;
  }

  await AsyncStorage.removeItem(ACTIVE_MODULE_STORAGE_KEY);
};

const moduleSlice = createSlice({
  name: "Module",
  initialState,
  reducers: {
    setSelectedModule: (state, action) => {
      const selectedModule = action.payload || null;
      persistSelectedModule(selectedModule);
      state.selectedModule = selectedModule;
    },
    clearSelectedModule: (state) => {
      persistSelectedModule(null);
      state.selectedModule = null;
    },
  },
});

export const { setSelectedModule, clearSelectedModule } = moduleSlice.actions;

export default moduleSlice.reducer;
