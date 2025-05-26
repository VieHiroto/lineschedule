const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORSを全許可（必要に応じて制限も可能）
app.use(cors());

app.use(bodyParser.json());

const LINE_TOKEN = process.env.LINE_TOKEN;

app.post('/', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).send('Missing userId or message');
  }

  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: userId,
      messages: [{
        type: 'text',
        text: message
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${LINE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).send('Message sent');
  } catch (err) {
    console.error('LINE送信エラー:', err.response?.data || err.message);
    res.status(500).send('Error sending message');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
