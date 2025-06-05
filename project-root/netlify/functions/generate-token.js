const crypto = require('crypto');
const fetch = require('node-fetch');

const TELEGRAM_BOT_TOKEN = '7285969203:AAGmZk5YCnPZggpWT8ast4fACtp4RF_8C5U';
const CHAT_ID = '7769607324';

let tokens = {}; // В памяти (обновляется при перезапуске функции, для реального — нужен DB)

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram API error: ${json.description}`);
}

exports.handler = async function(event, context) {
  try {
    const token = crypto.randomBytes(4).toString('hex');
    tokens[token] = { usedCount: 0, maxUses: 20 };
    await sendTelegramMessage(`Новый токен для пользователя: <b>${token}</b>`);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, token }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate token' }) };
  }
};
