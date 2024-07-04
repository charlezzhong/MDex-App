export function convertDateString(dateString) {
    if (!dateString) {
      return '';
    }

    let date = new Date(dateString);
    let month = date.getMonth(); // getMonth returns a zero-based index (0-11)

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return monthNames[month]; // This will return the month's name
  };