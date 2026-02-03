const http = require('http');
const https = require('https');
const { URL } = require('url');

const TARGET = process.env.TARGET || 'http://example.com';
const PORT = process.env.PORT || 8000;

const targetUrl = new URL(TARGET);
const proxyModule = targetUrl.protocol === 'https:' ? https : http;

const server = http.createServer((req, res) => {
  const options = {
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = proxyModule.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad gateway: ' + err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}, forwarding to ${TARGET}`);
});

module.exports = server;
