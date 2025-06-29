// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '.')));

// MongoDB connection URL (set this in your environment variables)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/esports_exposures';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Melt Schema and Model
const meltSchema = new mongoose.Schema({
  exposedBy: String,
  name: String,
  knownFor: [String],
  description: String,
  outcome: String,
  dateExposed: { type: Date, default: Date.now }
});

const Melt = mongoose.model('Melt', meltSchema);

// Ianfv Schema and Model (Optional for future expansion)
const ianfvSchema = new mongoose.Schema({
  name: String,
  discordId: String,
  knownFor: [String],
  description: String,
  reportedAt: { type: Date, default: Date.now }
});

const Ianfv = mongoose.model('Ianfv', ianfvSchema);

// Basic Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Optional: API route to fetch exposed individuals
app.get('/api/exposed/melts', async (req, res) => {
  try {
    const melts = await Melt.find();
    return res.json(melts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch exposed individuals' });
  }
});

// Optional: Add test data via POST (for dev/testing only)
app.post('/api/testdata', async (req, res) => {
  const meltData = new Melt({
    exposedBy: 'Solace',
    name: 'Melt',
    knownFor: ['Fraud', 'Doxxing', 'Abuse', 'P3do Behavior'],
    description: 'Faked income, lied about job, used doxxing against underage players.',
    outcome: 'Now in jail awaiting trial for armed robbery and battery.'
  });

  try {
    await meltData.save();
    return res.json({ success: true, message: 'Test data added!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not save test data.' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
