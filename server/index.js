import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

import leadRoutes from "./routes/lead.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", leadRoutes);
app.use("/api", chatRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server running successfully",
    time: new Date().toISOString()
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
