import "./config/env";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { connectDB, isDbConnected } from "./config/db";
import pickupRoutes from "./routes/pickupRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import hubRoutes from "./routes/hubRoutes";
import statsRoutes from "./routes/statsRoutes";
import communityRoutes from "./routes/communityRoutes";
import scanRoutes from "./routes/scanRoutes";
import recyclingCenterRoutes from "./routes/recyclingCenterRoutes";
import requestRoutes from "./routes/requestRoutes";
import rewardRoutes from "./routes/rewardRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  // Global middlewares with body size support for image scans
  app.use(cors());
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  const dbReady = await connectDB();
  if (!dbReady) {
    console.warn("⚠️ Users and other writes will stay in memory until MongoDB is reachable. Compass will not show them.");
  }

  // API Routes
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      app: "EcoMind Myanmar API",
      timestamp: new Date().toISOString(),
      database: isDbConnected() ? "MongoDB Connected" : "In-Memory Store (Active)",
      visionAi: process.env.OPENROUTER_API_KEY
        ? "OpenRouter Active"
        : process.env.GEMINI_API_KEY
          ? "Gemini Active"
          : "Mock Fallback Mode",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/rewards", rewardRoutes);
  app.use("/api/requests", requestRoutes);
  app.use("/api/scan", scanRoutes);
  app.use("/api/recycling-centers", recyclingCenterRoutes);
  app.use("/api/pickups", pickupRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/hubs", hubRoutes);
  app.use("/api/stats", statsRoutes);
  app.use("/api/community", communityRoutes);

  // Production: serve frontend build
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "../frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌿 EcoMind Myanmar API running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
