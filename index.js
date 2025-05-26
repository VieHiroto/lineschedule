const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const LINE_TOKEN = process.env.LINE_TOKEN;

app.use(cors());
app.use(bodyParser.json());

// 🔹 Render用：TampermonkeyからのPOST（userId & message）
app.post('/', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).send('Missing userId or message');
  }

  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: userId,
      messages: [
        {
          type: 'text',
          text: message
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${LINE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Tampermonkey → LINE メッセージ送信成功');
    res.status(200).send('Message sent');
  } catch (err) {
    console.error('LINE送信エラー:', err.response?.data || err.message);
    res.status(500).send('LINE送信失敗');
  }
});

// 🔹 Webhook用：LINEからの受信（「ユーザー」と送ったらIDを返す）
app.post('/webhook', async (req, res) => {
  const event = req.body.events?.[0];

  if (!event || event.type !== 'message' || event.message.type !== 'text') {
    return res.status(200).end(); // 無視するイベント
  }

  const message = event.message.text;
  const replyToken = event.replyToken;
  const userId = event.source.userId;

  if (message === 'ユーザー') {
    const replyMessage = `あなたのUser_IDは ${userId} です。`;

    try {
      await axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: replyMessage
          }
        ]
      }, {
        headers: {
          Authorization: `Bearer ${LINE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ ユーザーIDを返信しました');
      res.status(200).send('Replied');
    } catch (err) {
      console.error('返信エラー:', err.response?.data || err.message);
      res.status(500).send('Reply error');
    }
  } else {
    res.status(200).send('Ignored');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
