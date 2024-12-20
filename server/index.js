import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// Middleware
app.use(cors({
    origin:[process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads/profiles",express.static("uploads/profiles"));

// Simple root route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Setup routes
app.use("/api/auth", authRoutes);

// Server Setup
const server = app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});

// Database Connection
mongoose
  .connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
