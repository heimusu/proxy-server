const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
});
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
}

app.use(allowCrossDomain);

proxy.on('proxyReq', function(proxyReq, req, res) {
  // append
});

proxy.on('proxyRes', function(proxyRes, req, res) {
  const sc = proxyRes.headers['set-cookie'];
  if (Array.isArray(sc)) {
    proxyRes.headers['set-cookie'] = sc.map(sc => {
      return sc.split(';')
        .filter(v => v.trim().toLowerCase() !== 'secure')
        .join('; ')
    });
  }
});

proxy.on('error', function(err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something wrong.');
});

app.get('*', function(req, res) {
  proxy.web(req, res, {
    target: 'https://hogehoge.com',
  });
});

app.post('*', function(req, res) {
  proxy.web(req, res, {
    target: 'https://hogehoge.com',
  });
});


app.listen(8080);

