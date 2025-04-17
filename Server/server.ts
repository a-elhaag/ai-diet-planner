import express, { Request, Response } from "express";
import cors from "cors";
import sql, { config as SqlConfig } from "mssql";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const config: SqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("Backend server is running!");
});

// Test connection route
app.get("/test-connection", async (_req: Request, res: Response) => {
  try {
    await sql.connect(config);
    res.send("Connection is successful.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    res.status(500).send("Failed to connect to the database.");
  }
});

// /users route
app.get("/users", async (_req: Request, res: Response) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Users`;
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
