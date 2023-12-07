import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import determineOverlaps from "./AppointmentModel.js";

function getRandomColor() {
  // Darker colors for better contrast and readability
  const darken = 1.2;

  const r = Math.floor((Math.random() * 256) / darken);
  const g = Math.floor((Math.random() * 256) / darken);
  const b = Math.floor((Math.random() * 256) / darken);
  return `rgb(${r}, ${g}, ${b})`;
}

const AppointmentView = ({ inputJsonFilePath }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    //Fetch and process appointment data
    const fetchAppointmentData = async () => {
      try {
        const response = await import(`${inputJsonFilePath}`);
        setData(determineOverlaps(response.default));
      } catch (error) {
        console.error("Failed to load appointments", error);
      }
    };
    fetchAppointmentData();
  }, [inputJsonFilePath]);

  const calculateTopPosition = (startTimeConverted) => {
    const workdayStart = 9 * 60; // 9:00 AM in minutes
    const totalMinutesInWorkday = 12 * 60; // 12 hours workdays
    return (
      ((startTimeConverted - workdayStart) * 100) / totalMinutesInWorkday + "vh"
    );
  };

  const calculateHeight = (duration) => {
    const totalMinutesInWorkday = 12 * 60; // 12 hours workdays
    return (duration * 100) / totalMinutesInWorkday + "vh";
  };

  const calculateWidth = (overlapsCount) => {
    return `${100 / overlapsCount - 0.2}vw`; // Adjust the -0.2 value as needed for margins
  };

  const calculateLeft = (columnIndex, overlapsCount) => {
    return `${(columnIndex * 100) / overlapsCount}vw`;
  };

  return (
    <div>
      {Object.keys(data).map((key) => {
        const appointment = data[key];
        return (
          <div
            key={key}
            className="AppointmentViewSlot"
            style={{
              backgroundColor: getRandomColor(),
              top: calculateTopPosition(appointment.startTimeConverted),
              left: calculateLeft(
                appointment.columnIndex,
                appointment.overlapsCount
              ),
              width: calculateWidth(appointment.overlapsCount),
              height: calculateHeight(appointment.duration),
            }}
          >
            {key} - {appointment.startTime} - {appointment.duration}min
          </div>
        );
      })}
    </div>
  );
};

AppointmentView.propTypes = {
  inputJsonFilePath: PropTypes.string.isRequired,
};

export default AppointmentView;
