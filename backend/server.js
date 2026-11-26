const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vehicle_analytics',
  password: 'vision_password',
  port: 5432,
});

app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicle_events ORDER BY timestamp DESC LIMIT 30');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Analytics Fetch Error");
  }
});

app.listen(5001, () => console.log('🚀 Express Rest Bridge active on Port 5001'));
