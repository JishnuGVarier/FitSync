require("dotenv").config();

const dgram = require("dgram");
const WebSocket = require("ws");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const server = require("http").createServer(app);

// Add Morgan logging middleware
app.use(morgan("combined"));

const HOST = "127.0.0.1";

// Add CORS headers for HTTP requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `http://${HOST}:5500`);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

const wss = new WebSocket.Server({
  server,
  verifyClient: (info) => {
    const origin = info.origin;
    return origin === `http://${HOST}:5500`;
  },
});

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected!");

  ws.on("close", () => {
    console.log("WebSocket client disconnected.");
  });
});

// Serve static files (HTML)
app.use(express.static(__dirname + "/public"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message);
  });

// Add middleware to parse JSON
app.use(express.json());

// Import and use user routes
const userController = require("./controllers/user_controller");
app.post("/api/signup", userController.signup);
app.post("/api/login", userController.login);

// UDP server to receive data from Simulink
const inputHRServer = dgram.createSocket("udp4");

inputHRServer.on("message", (msg) => {
  const buffer = Buffer.from(msg);
  decoded = buffer.readDoubleLE(0);
  // Send the data to all connected WebSocket clients (browser)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ input: decoded }));
    }
  });
});

const predictedHRServer = dgram.createSocket("udp4");

predictedHRServer.on("message", (msg) => {
  const buffer = Buffer.from(msg);
  decoded = [];
  for (let i = 0; i < buffer.length; i += 4) {
    decoded.push(buffer.readFloatLE(i));
  }
  // Send the data to all connected WebSocket clients (browser)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ predicted: decoded }));
    }
  });
});

const anomalyServer = dgram.createSocket("udp4");

anomalyServer.on("message", (msg) => {
  const buffer = Buffer.from(msg);
  decoded = buffer.readDoubleLE(0);

  // Send the data to all connected WebSocket clients (browser)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ anomaly: decoded }));
    }
  });
});

inputHRServer.bind(8001, HOST);
predictedHRServer.bind(8002, HOST);
anomalyServer.bind(8003, HOST);

const NODE_SERVER_PORT = 8080;

server.listen(NODE_SERVER_PORT, () =>
  console.log("WebSocket server running on port " + NODE_SERVER_PORT)
);
