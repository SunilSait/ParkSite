/**
 * Helper utility functions.
 */

/**
 * Format a date string to a readable format.
 * @param {string} dateStr — ISO date string (YYYY-MM-DD)
 * @returns {string} — e.g. "10 Sep 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time string to 12-hour format.
 * @param {string} timeStr — "HH:MM"
 * @returns {string} — e.g. "10:00 AM"
 */
export function formatTime(timeStr) {
  if (!timeStr) return 'N/A';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Format amount as Indian Rupees.
 * @param {number} amount
 * @returns {string} — e.g. "₹90.00"
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0.00';
  return `₹${Number(amount).toFixed(2)}`;
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get error message from Axios error response.
 */
export function getErrorMessage(error) {
  if (error.response && error.response.data) {
    return error.response.data.error || error.response.data.message || 'Something went wrong';
  }
  if (error.message) {
    return error.message;
  }
  return 'Something went wrong';
}
