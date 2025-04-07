const currentDate = new Date();
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayOfWeek = daysOfWeek[currentDate.getDay()];
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; // Months are zero-based
const year = currentDate.getFullYear().toString().slice(-2); // Get last two digits of the year

export const formattedDate = `${dayOfWeek} ${day}/${month}/${year}`;
