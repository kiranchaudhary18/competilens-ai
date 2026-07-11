import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`CompetiLens Backend running on port ${PORT} in ${NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
