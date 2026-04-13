require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { submitDailyJournal } = require('./automate');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json());

// API Endpoint to trigger automation
app.post('/api/trigger-journal', async (req, res) => {
  const { formUrl, message, email } = req.body;

  if (!formUrl || !message || !email) {
    return res.status(400).json({ success: false, message: 'Missing formUrl, message, or email.' });
  }

  try {
    const result = await submitDailyJournal(formUrl, message, email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`DailyJournal Automation Server running on http://localhost:${PORT}`);
});
