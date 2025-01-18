import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monitor from "./Monitor";

const App = () => {
  const openWindows = () => {
    window.open("/left", "Left Monitor", "width=400,height=300");
    window.open("/right", "Right Monitor", "width=400,height=300");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Dual Monitor Setup - Shared Worker</h1>
              <button onClick={openWindows}>Open in twee vensters</button>
            </div>
          }
        />
        <Route path="/left" element={<Monitor source="left" />} />
        <Route path="/right" element={<Monitor source="right" />} />
      </Routes>
    </Router>
  );
};

export default App;
