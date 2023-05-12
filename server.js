require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Add this code to create a table in the database if it does not exist
function createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(255) NOT NULL,
        boothNumber VARCHAR(255) NOT NULL,
        feedback VARCHAR(255),
        vote INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    pool.query(sql, (error, results, fields) => {
      if (error) throw error;
      console.log('Table created successfully or already exists.');
    });
  }
createTable();  

app.use(cors({ origin: 'https://feedback-frontend-dc.theroyalsoft.com' }));
// app.use(cors({ origin: 'http://localhost:3001' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/api/feedback', (req, res) => {
  const { boothNumber, feedback, vote } = req.body;
  const uuid = uuidv4();
  const query = `INSERT INTO feedback (uuid, boothNumber, feedback, vote) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE vote = vote + ?`;
  const values = [uuid, boothNumber, feedback, vote, vote];
  pool.query(query, values, (error, results, fields) => {
    if (error) throw error;
    res.json({ message: 'Feedback submitted successfully' });
  });
});

app.get('/api/dashboard', (req, res) => {
  const query = 'SELECT COUNT(DISTINCT uuid) AS totalUsers, SUM(CASE WHEN vote > 0 THEN vote ELSE 0 END) AS totalUpvotes, SUM(CASE WHEN vote < 0 THEN vote ELSE 0 END) AS totalDownvotes FROM feedback';
  pool.query(query, (error, results, fields) => {
    if (error) throw error;
    const { totalUsers, totalUpvotes, totalDownvotes } = results[0];
    res.json({ totalUsers, totalUpvotes, totalDownvotes });
  });
});

app.get('/api/feedback', (req, res) => {
  const query = 'SELECT * FROM feedback';
  pool.query(query, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
