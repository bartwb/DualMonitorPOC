import React, { useState, useEffect } from "react";

// WebSocket connection
const socket = new WebSocket("ws://localhost:8080");

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
    const message = JSON.stringify({
      source,
      text: inputText,
      timestamp: new Date().toISOString(),
      extraData: hardcodedData[source].extraData, // Include hardcoded extra data
    });
    console.log(`[${source}] Sending message:`, message);
    socket.send(message);
  };

  useEffect(() => {
    socket.onopen = () => {
      console.log(`[${source}] Connected to WebSocket`);
    };

    socket.onmessage = async (event) => {
      console.log(`[${source}] Raw message received:`, event.data);

      try {
        let message = event.data;

        if (event.data instanceof Blob) {
          message = await event.data.text(); // Convert Blob to string
        }

        const data = JSON.parse(message);
        console.log(`[${source}] Parsed message:`, data);

        // Add the received message to the list if it's from the other monitor
        if (data.source !== source) {
          setReceivedMessages((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error(`[${source}] Error parsing message:`, error);
      }
    };

    socket.onclose = () => {
      console.log(`[${source}] Disconnected from WebSocket`);
    };

    socket.onerror = (error) => {
      console.error(`[${source}] WebSocket error:`, error);
    };

    return () => {
      socket.close();
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
