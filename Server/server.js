require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

app.get("/users", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Users`; // Replace with your actual table
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
