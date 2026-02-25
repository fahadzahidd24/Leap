import axios from "axios";
import { store } from "../redux/store";
import { logoutUser } from "../redux/features/userSlice";
import { Alert } from "react-native";
import { resetEntries } from "../redux/features/entriesSlice";
import { resetChat } from "../redux/features/chatSlice";

const baseURL = "https://stride-api.leaptechsolutions.com/api";
const publicURL = "https://stride-api.leaptechsolutions.com/public";
// export const baseURL = "https://gentle-cub-positively.ngrok-free.app/api";
// const publicURL = "https://gentle-cub-positively.ngrok-free.app/public";

const publicApi = axios.create({
  baseURL,
});

const privateApi = (token) => {
  const instance = axios.create({
    baseURL, // Ensure you define the `baseURL` somewhere in your environment
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
                store.dispatch(resetEntries());
                store.dispatch(resetChat());
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

export { publicURL, publicApi, privateApi };

// const privateApi = (token) =>
//   axios.create({
//     baseURL,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

// export { publicURL, publicApi, privateApi };
