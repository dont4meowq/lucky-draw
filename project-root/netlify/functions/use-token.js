let tokens = {}; // общий state - проблема

exports.handler = async function(event, context) {
  try {
    const { token } = JSON.parse(event.body);
    if (!token) return { statusCode: 400, body: JSON.stringify({ error: 'No token provided' }) };
    const record = tokens[token];
    if (!record) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid token' }) };
    if (record.usedCount >= record.maxUses) return { statusCode: 400, body: JSON.stringify({ error: 'Token expired' }) };
    record.usedCount++;
    return { statusCode: 200, body: JSON.stringify({ success: true, usedCount: record.usedCount, remaining: record.maxUses - record.usedCount }) };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
