import "./App.css";
import React from "react";
import AppointmentView from "./AppointmentView.js";

function App() {
  // Path to the JSON file containing an array of appointment data
  // For example: [{ id: 1, start: '15:00', duration: 90 }, { id: 2, start: '10:00', duration: 20 }, ...]
  const inputJsonFilePath = "./input.json";

  return (
    <div className="App">
      <AppointmentView inputJsonFilePath={inputJsonFilePath} />
    </div>
  );
}

export default App;
