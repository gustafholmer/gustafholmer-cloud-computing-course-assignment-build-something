import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import apiGateway from "./api-gateway";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(
  cors({
    origin: [
      'http://frontend-service',
      'http://localhost:30080',
      'http://frontend-service.default.svc.cluster.local',
      'http://localhost',
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
  })
);

app.use(bodyParser.json());

app.use("/api", apiGateway);

app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
