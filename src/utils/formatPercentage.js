/**
 * Formats a percentage value following the rules:
 * - If Target = 0 and Actual > 0 → "100%+" (Infinity case)
 * - If Target = 0 and Actual = 0 → "—%" (NaN case)
 * - If Target > 0 → Display Actual ÷ Target (ceil if > 100)
 * 
 * @param {number} value - The percentage value to format
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value) => {
  // Handle NaN (Target = 0, Actual = 0)
  if (isNaN(value)) {
    return "—%";
  }
  // Handle Infinity (Target = 0, Actual > 0)
  if (value === Infinity || value === -Infinity) {
    return "100%+";
  }
  // Show actual percentage (ceil for > 100, round otherwise)
  if (value > 100) {
    return `${Math.ceil(value)}%`;
  }
  return `${Math.round(value)}%`;
};

/**
 * Calculates and formats percentage from achieved/goals
 * - If Target = 0 and Actual > 0 → "100%+"
 * - If Target = 0 and Actual = 0 → "—%"
 * - If Target > 0 → Display Actual ÷ Target
 * 
 * @param {number} achieved - The achieved value (Actual)
 * @param {number} goals - The goal value (Target)
 * @returns {string} - Formatted percentage string
 */
export const calcPercentage = (achieved, goals) => {
  const numAchieved = Number(achieved) || 0;
  const numGoals = Number(goals) || 0;
  
  // If Target = 0
  if (numGoals === 0) {
    // If Actual > 0 → display 100%+
    if (numAchieved > 0) {
      return "100%+";
    }
    // If Actual = 0 → display —%
    return "—%";
  }
  
  // If Target > 0: Display Actual ÷ Target
  const percentage = (numAchieved / numGoals) * 100;
  
  if (percentage > 100) {
    return `${Math.ceil(percentage)}%`;
  }
  return `${Math.round(percentage)}%`;
};

