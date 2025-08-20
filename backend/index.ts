import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cabinsRoutes from "./src/routes/cabinsRoutes.js";
import bookingsRoutes from "./src/routes/bookingsRoutes.js";
import guestsRoutes from "./src/routes/guestsRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());
app.use("/api/cabins", cabinsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/guests", guestsRoutes);
app.use("/api/settings", settingsRoutes);

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
