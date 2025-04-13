const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let conversations = {};

app.post('/chat', async (req, res) => {
    const { sessionId, userMessage } = req.body;

    if (!sessionId || !userMessage) {
        return res.status(400).json({ error: 'Missing sessionId or userMessage' });
    }

    if (!conversations[sessionId]) {
        conversations[sessionId] = [];
    }

    conversations[sessionId].push({ role: 'user', content: userMessage });

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4-1106-preview',
            messages: [
                { role: 'system', content: "You are a friendly debt relief assistant helping users qualify for debt help. Capture user's name, debt amount, hardship reason, state, and offer soft pull consent." },
                ...conversations[sessionId]
            ],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const botMessage = response.data.choices[0].message.content;

        conversations[sessionId].push({ role: 'assistant', content: botMessage });

        res.json({ botMessage });
    } catch (error) {
        console.error('Error talking to OpenAI:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
});

app.post('/submit-lead', (req, res) => {
    const leadData = req.body;
    console.log('Captured lead:', leadData);
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.send('AI Closer Bot is running.');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
