const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI API setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { sessionId, userMessage } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: 'Missing userMessage' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const botMessage = completion.data.choices[0].message.content;
    res.json({ botMessage });
  } catch (err) {
    console.error('OpenAI error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate bot reply' });
  }
});

// Submit lead endpoint
app.post('/submit-lead', (req, res) => {
  const leadData = req.body;
  console.log('New Lead Captured:', leadData);

  // Here you can save to Google Sheets, webhook, database, etc

  res.json({ success: true, message: 'Lead received successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

