import axios from "axios";

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAX8on5MK8yYdmAYr5FQG3YVcGmUFmEyvU`
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
