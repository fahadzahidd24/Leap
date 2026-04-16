import axios from "axios";
import { store } from "../redux/store";
import { logoutUser } from "../redux/features/userSlice";
import { Alert } from "react-native";
import { resetEntries } from "../redux/features/entriesSlice";
import { resetChat } from "../redux/features/chatSlice";
import { resetGamification } from "../redux/features/gamificationSlice";
import { clearSelectedModule } from "../redux/features/moduleSlice";
import { MODULE_KEYS } from "../constants/moduleConfig";

export const baseURL = "https://gentle-cub-positively.ngrok-free.app/api";
const publicURL = "https://gentle-cub-positively.ngrok-free.app/public";
// export const baseURL = "https://api.gitsagroup.com/api";
// const publicURL = "https://api.gitsagroup.com/public";

const getModulePrefix = (moduleKey) =>
  moduleKey === MODULE_KEYS.QUEST ? "/quest" : "";

const getScopedBaseURL = ({ shared = false, moduleKey } = {}) => {
  if (shared) {
    return baseURL;
  }

  const selectedModule =
    moduleKey || store.getState()?.Module?.selectedModule || MODULE_KEYS.LEAP;

  return `${baseURL}${getModulePrefix(selectedModule)}`;
};

const publicApi = axios.create({
  baseURL,
});

const createPrivateApi = (token, options = {}) => {
  const instance = axios.create({
    baseURL: getScopedBaseURL(options),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Any status code that lies within the range of 2xx will cause this function to trigger
      return response;
    },
    (error) => {
      // Any status codes that fall outside the range of 2xx will cause this function to trigger
      const originalRequest = error.config;
      if (error.response && error.response.status === 401) {
        // Dispatch logout action on 401 error
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => {
                store.dispatch(logoutUser());
                store.dispatch(clearSelectedModule());
                store.dispatch(resetEntries());
                store.dispatch(resetChat());
                store.dispatch(resetGamification());
              },
            },
          ],
          { cancelable: false } // Prevent closing the alert without user action
        );

        // Optionally, reject the promise with the error to handle in individual API calls if needed
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const privateApi = (token, options = {}) =>
  createPrivateApi(token, { shared: false, ...options });

const privateSharedApi = (token) => createPrivateApi(token, { shared: true });

export { publicURL, publicApi, privateApi, privateSharedApi };

// const privateApi = (token) =>
//   axios.create({
//     baseURL,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

// export { publicURL, publicApi, privateApi };
