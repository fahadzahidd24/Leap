import axios from "axios";

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA7MT7Dx9W58D1PGlFH6f1S2zO7lymcDqg`
    );

    if (response.data.status === "OK") {
      const address = response.data.results[0]?.formatted_address;
      return address || "Address not found";
    } else {
      console.error("Error fetching address:", response.data.status);
      return "Address not found";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Address not found";
  }
};
