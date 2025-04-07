// export function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
//   const R = 3958.8; // Radius of the Earth in miles
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c;

//   return distance;
// }

export async function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat1},${lon1}&destinations=${lat2},${lon2}&key=AIzaSyA7MT7Dx9W58D1PGlFH6f1S2zO7lymcDqg`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.rows[0].elements[0].status === "OK") {
      console.log("yo");
      const distanceText = data.rows[0].elements[0].distance.text;
      // console.log(distanceText) // e.g., "1200 ft"
      let distanceInMiles;

      if (distanceText.includes("ft")) {
        // Extract the numeric value and convert to miles
        const distanceInFeet = parseFloat(distanceText);
        distanceInMiles = distanceInFeet / 5280; // Convert feet to miles
      } else if (distanceText.includes("miles") || distanceText.includes("mi") ) {
        // If already in miles, just extract the number
        distanceInMiles = parseFloat(distanceText);
      }
      console.log({distanceInMiles})
      return distanceInMiles; // distance in miles
    } else {
      throw new Error("Distance calculation failed");
    }
  } catch (error) {
    console.error("Error fetching distance from Google Maps API:", error);
    return null;
  }
}
