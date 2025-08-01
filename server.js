const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Use environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MongoDB Schema
const emailSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Email = mongoose.model('Email', emailSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the application if MongoDB connection fails
});

// Email Subscription Endpoint
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid email." });
    }

    // Check if email already exists
    const existing = await Email.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already subscribed." });
    }

    // Create a new email subscription
    const newEmail = await Email.create({ email });
    return res.json({ success: true, message: "Subscribed!", email: newEmail.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
