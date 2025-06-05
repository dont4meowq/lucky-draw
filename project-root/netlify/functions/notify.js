const fetch = require('node-fetch');

const TELEGRAM_BOT_TOKEN = '7285969203:AAGmZk5YCnPZggpWT8ast4fACtp4RF_8C5U';
const CHAT_ID = '7769607324';

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
    const { prize } = JSON.parse(event.body);
    if (!prize) return { statusCode: 400, body: JSON.stringify({ error: 'No prize specified' }) };
    await sendTelegramMessage(`🎉 Пользователь выиграл: <b>${prize}</b>`);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch(err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send notification' }) };
  }
};
