const express = require('express');
const { Pool } = require('pg');
const userRoutes = require("./routes/user");
const app = express();
const pool = require("./config/db");

require("dotenv").config();
const port = process.env.PORT || 5000;
// Middleware to parse JSON bodies
app.use(express.json());



app.use("/api",userRoutes);

// A test route to check database connection
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    res.send('Successfully connected to the database!');
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