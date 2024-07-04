export const getSeasonIcon = season => {
    const seasonIconMap = {
      Summer: '☀️',
      Fall: '🍁',
      Spring: '🌸',
      Winter: '⛄️',
    };
    return seasonIconMap[season] || ' '; // Return a question mark emoji if no match is found
  };