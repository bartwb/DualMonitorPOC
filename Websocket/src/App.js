import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monitor from "./Monitor"; // Import the Monitor component

const App = () => {
  const openWindows = () => {
    window.open("/left", "Left Monitor", "width=400,height=300");
    window.open("/right", "Right Monitor", "width=400,height=300");
  };

  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            <div>
              <h1>Dual Monitor Setup - WebSockets</h1>
              <button onClick={openWindows}>Open in twee vensters</button>
            </div>
          }
        />

        {/* Left monitor route */}
        <Route path="/left" element={<Monitor source="left" />} />

        {/* Right monitor route */}
        <Route path="/right" element={<Monitor source="right" />} />
      </Routes>
    </Router>
  );
};

export default App;
