// ===== Updated server.js for GPT-4o Full AI Dynamic Bot =====

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI API setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// /chat endpoint
app.post('/chat', async (req, res) => {
  const { sessionId, userMessage } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: 'Missing userMessage' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // 🔥 Upgraded to GPT-4o
      messages: [
        { role: 'system', content: `You are Ember, a friendly AI assistant who helps users explore options for reducing debt, saving money, and improving their financial situation. Be supportive, casual but professional. Always encourage them to move forward casually if they hesitate. Answer user questions naturally.` },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    });

    const botMessage = completion.choices[0].message.content;
    res.json({ botMessage });
  } catch (err) {
    console.error('OpenAI error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate bot reply' });
  }
});

// /submit-lead endpoint
app.post('/submit-lead', (req, res) => {
  const leadData = req.body;
  console.log('New Lead Captured:', leadData);

  res.json({ success: true, message: 'Lead received successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

