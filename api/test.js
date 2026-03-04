const https = require('https');

export default async function handler(req, res) {
  const body = JSON.stringify({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'say hi' }]
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const result = await new Promise((resolve, reject) => {
    const req = https.request(options, (r) => {
      let data = '';
      r.on('data', chunk => data += chunk);
      r.on('end', () => resolve({ status: r.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  res.status(result.status).send(result.body);
}
