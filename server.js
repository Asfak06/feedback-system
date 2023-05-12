require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

const Feedback = sequelize.define('feedback', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  boothNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  feedback: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  vote: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  tableName: 'feedback',
});
// Add this code to create a table in the database if it does not exist
sequelize.sync({ force: false })
  .then(() => {
    console.log('Table created successfully or already exists.');
  })
  .catch((error) => {
    console.error('Error creating table:', error);
  });

app.use(cors({ origin: 'https://feedback-frontend-dc.theroyalsoft.com' }));
// app.use(cors({ origin: 'http://localhost:3001' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/api/feedback', async (req, res) => {
  const { boothNumber, feedback, vote } = req.body;
  const uuid = uuidv4();
  try {
    await Feedback.upsert({ uuid, boothNumber, feedback, vote });
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const totalUsers = await Feedback.count({ distinct: 'uuid' });
    const totalUpvotes = await Feedback.sum('vote', { where: { vote: { [Sequelize.Op.gt]: 0 } } });
    const totalDownvotes = await Feedback.sum('vote', { where: { vote: { [Sequelize.Op.lt]: 0 } } });
    res.json({ totalUsers, totalUpvotes, totalDownvotes });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.findAll();
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
