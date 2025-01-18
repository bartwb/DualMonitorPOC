import React, { useState, useEffect } from "react";

// Connect to the shared worker
const worker = new SharedWorker("/sharedWorker.js");

// Hardcoded data for each monitor
const hardcodedData = {
  left: {
    title: "Left Monitor Information",
    description: "This is the left monitor displaying additional information.",
    extraData: {
      array: ["leftItem1", "leftItem2", "leftItem3"],
      object: { monitorKey: "leftValue" },
    },
  },
  right: {
    title: "Right Monitor Information",
    description: "This is the right monitor displaying additional information.",
    extraData: {
      array: ["rightItem1", "rightItem2", "rightItem3"],
      object: { monitorKey: "rightValue" },
    },
  },
};

const Monitor = ({ source }) => {
  const [inputText, setInputText] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const sendMessage = () => {
    const message = {
      source,
      text: inputText,
      timestamp: new Date().toISOString(),
      extraData: hardcodedData[source].extraData, // Send hardcoded extra data
    };
    console.log(`[${source}] Sending message:`, message);
    worker.port.postMessage(message);
  };

  useEffect(() => {
    worker.port.onmessage = (event) => {
      console.log(`[${source}] Message received from worker:`, event.data);

      // Append the received message to the list
      setReceivedMessages((prev) => [...prev, event.data]);
    };

    // Start the worker's port
    worker.port.start();

    return () => {
      worker.port.close();
    };
  }, [source]);

  const { title, description, extraData } = hardcodedData[source];

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <strong>Array om te verzenden:</strong> {extraData.array.join(", ")}
      </div>
      <div>
        <strong>Object om te verzenden:</strong> {JSON.stringify(extraData.object)}
      </div>
      <br></br>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type something"
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <br></br>
        <strong>Received Messages:</strong>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.source}:</strong>
              <br /> 
              Text: {msg.text} 
              <br />
              Array: {msg.extraData?.array?.join(", ")}
              <br />
              Object: {JSON.stringify(msg.extraData?.object)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Monitor;
