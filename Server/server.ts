import express, { Request, Response } from "express";
import cors from "cors";
import sql, { config as SqlConfig } from "mssql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
const API_URL = "http://192.168.1.64:3000";


const app = express();
app.use(cors());
app.use(express.json());

const config: SqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  port: parseInt(process.env.DB_PORT || "1433"), // optional, default is 1433
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

console.log("DB config:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Root route
app.get("/", (_req: Request, res: Response): void => {
  res.send("Backend server is running!");
});

// Test DB connection
app.get("/test-connection", async (_req: Request, res: Response): Promise<void> => {
  try {
    await sql.connect(config);
    res.send("Connection is successful.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    res.status(500).send("Failed to connect to the database.");
  }
});

// Get all users
app.get("/users", async (_req: Request, res: Response): Promise<void> => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Users`;
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// Sign up
app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, preferences } = req.body;

  if (!email || !password || !name || !preferences) {
    res.status(400).send("Please provide all required fields.");
    return;
  }

  try {
    await sql.connect(config);

    const existingUser = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
    if (existingUser.recordset.length > 0) {
      res.status(400).send("User already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO Users (name, email, password, preferences)
      VALUES (
        ${name},
        ${email},
        ${hashedPassword},
        ${JSON.stringify(preferences)}
      )
    `;

    res.status(201).json({ message: "User created successfully!" });

  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).send("Something went wrong while creating the user.");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
