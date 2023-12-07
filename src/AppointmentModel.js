// We have made the assumption that the appointments are all in the same day
function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function determineOverlaps(appointments) {
  let overlapsCounter = {}; // a dictionary to store each appointment id how many time, it will interact with others appointments for the same group schedule and also add it a column index
  let timePoints = []; // an array to destructure the appointments into 2 categories: start and end which will help for having better algorithm to determine the overlaps
  let columnIndexes = new Set(); // a set to store the column indexes that are already used and then defined the index in the group of appointments
  let eventsInSameGroup = new Set(); // a set to store the appointments that are in the same group schedule
  let maxColumnIndex = 0; // a variable to store the maximum column index that can be reached in the group of appointments

  // Loop through the appointments and destructure them into timePoints with start and end time
  // Also initialize overlapsCounter
  appointments.forEach((appointment) => {
    if (!overlapsCounter[appointment.id]) {
      overlapsCounter[appointment.id] = {
        count: 0,
        startTime: appointment.start,
        startTimeConverted: convertTimeToMinutes(appointment.start),
        duration: appointment.duration,
        columnIndex: null,
      };
    }
    timePoints.push({
      time: overlapsCounter[appointment.id].startTimeConverted,
      type: "start",
      id: appointment.id,
    });
    timePoints.push({
      time:
        overlapsCounter[appointment.id].startTimeConverted +
        appointment.duration,
      type: "end",
      id: appointment.id,
    });
  });

  // Sort timePoints by time, prioritizing end times over start times
  timePoints.sort((a, b) => a.time - b.time || (a.type === "end" ? -1 : 1));

  // Loop through the timePoints array and determine the overlaps
  timePoints.forEach((timePoint) => {
    if (timePoint.type === "start") {
      //Find the first available index column
      let columnIndex = 0;
      while (columnIndexes.has(columnIndex)) {
        columnIndex++;
      }
      columnIndexes.add(columnIndex);

      // Save the maximum column index that can be reached in the group schedule of appointments
      maxColumnIndex = Math.max(maxColumnIndex, columnIndex);

      // Save the column index for a specific appointment id
      overlapsCounter[timePoint.id]["columnIndex"] = columnIndex;

      // Add the appointment id to the set of appointments that are in the same group schedule
      eventsInSameGroup.add(timePoint.id);
    } else {
      // Remove the appointment id from the set of appointments that are in the same group schedule
      columnIndexes.delete(overlapsCounter[timePoint.id]["columnIndex"]);

      // When = 0, it means that the appointment is the last one in the group of appointments, so we can save the maximum column index that can be reached in the group of appointments
      if (columnIndexes.size === 0) {
        eventsInSameGroup.forEach((eventId) => {
          overlapsCounter[eventId]["overlapsCount"] = maxColumnIndex + 1;
        });

        maxColumnIndex = 0;
        eventsInSameGroup.clear();
      }
    }
  });

  return overlapsCounter;
}

export default determineOverlaps;
