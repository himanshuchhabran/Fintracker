const express = require('express');
const { Pool } = require('pg');
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budgets");
const dashboardRoutes = require('./routes/dashboard');
const riskRoutes = require('./routes/risk'); 
const goalRoutes = require('./routes/goals');
const app = express();
const pool = require("./config/db");
const cors = require('cors');

const port = process.env.SERVER_PORT || 5000;

const corsOptions = {
  origin: 'https://mudra-plan.vercel.app/', // Replace with your Vercel URL
};
app.use(cors(corsOptions));
// Middleware to parse JSON bodies
app.use(express.json());




app.use("/api",userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/risk', riskRoutes); 
app.use('/api/goals', goalRoutes);

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