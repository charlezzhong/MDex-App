export const baseUrl = 'https://api.thisismdex.com/ipa';
// export const baseUrl = 'http://localhost:8000/ipa';
// export const baseUrlPicture = 'http://localhost:8000';
export const baseUrlPicture = 'https://api.thisismdex.com';

export const COLORS = {
  primary: '#0C0C52',
  white: '#fff',
};

export const convertTo12HourFormat = time24hr => {
  // Split the time into hours and minutes
  const [hours, minutes] = time24hr.split(':').map(Number);

  // Determine AM or PM
  const ampm = hours < 12 ? 'AM' : 'PM';

  // Convert to 12-hour format
  let hours12 = hours % 12;
  hours12 = hours12 || 12; // Set 12 for midnight

  // Check if the time is exactly on the hour
  if (minutes === 0) {
    // Format as '4 PM'
    return `${hours12} ${ampm}`;
  } else {
    // Format as '4:01 PM', without leading zero for the hour
    return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  }
};
