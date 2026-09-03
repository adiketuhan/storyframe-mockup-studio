/**
 * Add minutes to time strings like "14:30", "09:05", "2:15 PM" or "8:42 PM"
 */
export const incrementTimeString = (timeStr: string, minutesToAdd: number): string => {
  try {
    // Check if format contains AM/PM (e.g., "08:42 PM" or "8:42 PM")
    const isAmPm = /([0-9]{1,2}):([0-9]{2})\s*(AM|PM)/i.test(timeStr);
    
    if (isAmPm) {
      const match = timeStr.match(/([0-9]{1,2}):([0-9]{2})\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        let minutes = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();

        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        let totalMins = (hours * 60 + minutes + minutesToAdd) % (24 * 60);
        if (totalMins < 0) totalMins += 24 * 60;

        let newHours = Math.floor(totalMins / 60);
        const newMinutes = totalMins % 60;
        const newAmpm = newHours >= 12 ? 'PM' : 'AM';

        newHours = newHours % 12;
        if (newHours === 0) newHours = 12;

        const padMins = newMinutes.toString().padStart(2, '0');
        return `${newHours}:${padMins} ${newAmpm}`;
      }
    }

    // Standard 24h format "14:30" or "09:45"
    const match24 = timeStr.match(/([0-9]{1,2})[:.]([0-9]{2})/);
    if (match24) {
      let hours = parseInt(match24[1], 10);
      let minutes = parseInt(match24[2], 10);

      let totalMins = (hours * 60 + minutes + minutesToAdd) % (24 * 60);
      if (totalMins < 0) totalMins += 24 * 60;

      const newHours = Math.floor(totalMins / 60).toString().padStart(2, '0');
      const newMinutes = (totalMins % 60).toString().padStart(2, '0');

      return `${newHours}:${newMinutes}`;
    }

    return timeStr;
  } catch {
    return timeStr;
  }
};
