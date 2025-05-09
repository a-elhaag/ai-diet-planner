import express, { Request, Response } from "express";
import cors from "cors";
import sql, { config as SqlConfig } from "mssql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import os from "os";

// Load .env variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Get local IPv4 address
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (!netInterface) continue;

    for (const net of netInterface) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const localIP = getLocalIP();
const PORT = parseInt(process.env.PORT || "3000", 10);
const API_URL = `http://${localIP}:${PORT}`;

console.log(`API URL: ${API_URL}`);

const app = express();
app.use(cors());
app.use(express.json());

const config: SqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  port: parseInt(process.env.DB_PORT || "1433", 10),
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

// Sign in
app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Please provide both email and password.");
    return;
  }

  try {
    await sql.connect(config);

    const result = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
    const user = result.recordset[0];

    if (!user) {
      res.status(401).send("Invalid email or password.");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send("Invalid email or password.");
      return;
    }

    res.status(200).json({
      message: "Sign-in successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferences: {
          dietType: user.dietType,
          dailyCalories: user.dailyCalories,
          allergies: user.allergies,
          freeDay: user.freeDay,
        },
      },
    });
  } catch (err) {
    console.error("Error during sign-in:", err);
    res.status(500).send("Something went wrong during sign-in.");
  }
});

// Start server on all interfaces (so friends can connect)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server is running at ${API_URL}`);
});
