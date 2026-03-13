import "dotenv/config";

import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const PORT = Number(process.env.PORT ?? 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin === CLIENT_ORIGIN) return callback(null, true);

      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof err?.status === "number" ? err.status : 500;

  const message =
    status >= 500
      ? "Internal Server Error"
      : String(err?.message ?? "Error");

  res.status(status).json({ error: message });
};

app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();