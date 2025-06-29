const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Use environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL; // Set this in your hosting environment

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MongoDB Schema for Email Subscribers
const emailSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Email = mongoose.model('Email', emailSchema);

// MongoDB Schema for Comments
const commentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', commentSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Email Subscription Endpoint
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const existing = await Email.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already subscribed." });
    }

    await Email.create({ email });
    return res.json({ success: true, message: "Subscribed!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Post a Comment
app.post('/comment', async (req, res) => {
  const { email, message } = req.body;

  try {
    const newComment = new Comment({ email, message });
    await newComment.save();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Fetch All Comments
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    return res.json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not fetch comments." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
