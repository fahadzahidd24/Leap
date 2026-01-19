// Malaysian timezone (UTC+8)
export const TIMEZONE = "Asia/Kuala_Lumpur";
const TIMEZONE_OFFSET = 8 * 60; // UTC+8 in minutes

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Get current date in Malaysian timezone (UTC+8)
export const getMalaysianDate = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + TIMEZONE_OFFSET * 60000);
};

// Get formatted date string for API calls (dd/mm/yyyy)
export const getMalaysianDateString = () => {
  const date = getMalaysianDate();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const currentDate = getMalaysianDate();

const dayOfWeek = daysOfWeek[currentDate.getDay()];
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; // Months are zero-based
const year = currentDate.getFullYear().toString().slice(-2); // Get last two digits of the year

export const formattedDate = `${dayOfWeek} ${day}/${month}/${year}`;

// Helper to format any date in Malaysian timezone
export const formatDateMY = (date, options = {}) => {
  return new Date(date).toLocaleDateString("en-MY", {
    timeZone: TIMEZONE,
    ...options,
  });
};

// Helper to format date and time in Malaysian timezone
export const formatDateTimeMY = (date, options = {}) => {
  return new Date(date).toLocaleString("en-MY", {
    timeZone: TIMEZONE,
    ...options,
  });
};
