const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // CORS許可
app.use(bodyParser.json());

const LINE_TOKEN = process.env.LINE_TOKEN;

app.post('/', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).send('Missing userId or message');
  }

  try {
    // LINEへ送信（正しい形式）
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${LINE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).send('Message sent');
  } catch (error) {
    console.error('LINE送信エラー:', error.response?.data || error.message);
    res.status(500).send('LINE送信失敗');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
