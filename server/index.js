const express = require('express');
const { Pool } = require('pg');
const userRoutes = require("./routes/user");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 5000;
// Middleware to parse JSON bodies
app.use(express.json());


// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use("/api",userRoutes);

// A test route to check database connection
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    res.send('Successfully connected to the database!');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database', err);
    res.status(500).send('Failed to connect to the database.');
  }
});

// A simple root route
app.get('/', (req, res) => {
  res.send('Hello from the Mudra-Plan Server!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});