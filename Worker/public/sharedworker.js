// sharedWorker.js

const connections = [];

onconnect = (event) => {
  const port = event.ports[0];
  connections.push(port);

  console.log("New connection established. Total connections:", connections.length);

  // Listen for messages from any connection
  port.onmessage = (e) => {
    console.log("Message received in worker:", e.data);

    // Broadcast the message to all other connections
    connections.forEach((conn) => {
      if (conn !== port) {
        conn.postMessage(e.data);
      }
    });
  };

  port.onclose = () => {
    console.log("Connection closed");
    const index = connections.indexOf(port);
    if (index > -1) {
      connections.splice(index, 1);
    }
  };
};
