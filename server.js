// ===== Updated server.js for GPT-4o Full AI Dynamic Closer =====

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
      model: 'gpt-4o', // Using GPT-4o 🔥
      messages: [
        {
          role: 'system',
          content: `
You are Ember, a friendly AI debt relief assistant.
Your job is to guide users toward qualifying for debt relief programs that could help reduce or forgive part of their debt.

Always be on the user's side. Speak casually but professionally.
Make users feel excited about the opportunity to lower or eliminate their debts.

RULES:
1. You first ask simple, easy questions to qualify them (debt amount, state, hardship).
2. If they qualify (most users will), congratulate them and hype them up casually. Make them feel optimistic!
3. Then politely request their contact information (name, phone number, email) so you can "prepare their results."
4. After capturing contact info, suggest doing a soft credit pull to better estimate how much they can qualify for.
5. Emphasize: "No impact on your credit score!" Reassure them.
6. If user agrees, continue moving forward. If they hesitate, politely encourage but respect their decision.
7. After soft pull consent, act like you are preparing their personalized debt reduction plan.
8. Offer to "start preparing settlement documents on their behalf" so they can get relief started today.
9. Always give users the option to talk to a live agent if they prefer.
10. If users ask random questions or hesitate, always answer naturally, casually, and then pull them back to the process gently.
11. Never explain DIY debt strategies (no snowball/avalanche/consolidation plans).
12. Never scare, never hard sell. Always sound like their personal advocate helping them win against debt.

Remember:
Your goal is to qualify the user, capture the lead, and gently move them toward enrollment — all while making them feel excited, supported, and empowered!
`
        },
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

