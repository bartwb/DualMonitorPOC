import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monitor from "./Monitor"; 

const App = () => {

  const openWindows = () => {
    const leftWin = window.open("/left", "Left Monitor", "width=600,height=600");
    const rightWin = window.open("/right", "Right Monitor", "width=600,height=600");

    window.leftWin = leftWin;
    window.rightWin = rightWin;
  
    const handleMessage = (event) => {
      console.log("Message received in parent:", event.data);
  
      if (event.data.type === "SEND_TEXT") {
        const { source, text } = event.data;
  
        if (source === "left") {
          rightWin?.postMessage({ type: "RECEIVE_TEXT", text }, "*");
        } else if (source === "right") {
          leftWin?.postMessage({ type: "RECEIVE_TEXT", text }, "*");
        }
      }
    };
  
    window.addEventListener("message", handleMessage);
  
    leftWin.onload = () => leftWin.postMessage({ type: "INIT", source: "left" }, "*");
    rightWin.onload = () => rightWin.postMessage({ type: "INIT", source: "right" }, "*");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Dual Monitor Setup - Message Events</h1>
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
