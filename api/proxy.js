const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = JSON.stringify(req.body);
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
      const r = https.request(options, (resp) => {
        let data = '';
        resp.on('data', c => data += c);
        resp.on('end', () => resolve({ status: resp.statusCode, body: data }));
      });
      r.on('error', reject);
      r.write(body);
      r.end();
    });

    try {
      return res.status(result.status).json(JSON.parse(result.body));
    } catch(e) {
      return res.status(result.status).send(result.body);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
