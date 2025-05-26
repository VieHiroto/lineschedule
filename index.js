const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const LINE_TOKEN = 'LALbajxclWZI71fVt+Wzzf4wT114/P0kr+XaOR3JV46OiISzzBF+imTZpnGGeUqD2OhNw5romYcM1icQDVZ/PnnnnQT2xoV6m1agu0eTMp3apk4T6C33AO3T1DaURrztBdvAMhsgNERN4NgP/uSrcQdB04t89/1O/w1cDnyilFU='; // ← あなたのトークンに置き換えてね

const app = express();
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).send('Missing userId or message');
  }

  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: userId,
      messages: [{ type: 'text', text: message }]
    }, {
      headers: {
        'Authorization': `Bearer ${LINE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).send('Message sent');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error sending message');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
