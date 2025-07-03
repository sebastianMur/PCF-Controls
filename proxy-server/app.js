const [n, a, f, e] = process.argv;

const config = require('config');
const clientid = config.get(`${e}.clientid`);
const secret = config.get(`${e}.secret`);
const tenantid = config.get(`${e}.tenantid`);
const resource = config.get(`${e}.resource`);
const target = config.get(`${e}.target`);

const fetch = require('sync-fetch');
require('url');
const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 3030;
const HOST = 'localhost';
let expiry = undefined;
let token = undefined;

app.use(morgan('dev'));

app.use(
  '/',
  createProxyMiddleware({
    target: target,
    changeOrigin: true,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      if (!expiry || !token || expiry < Date.now() / 1000) {
        console.log('refreshing token');
        var urlencoded = new URLSearchParams();
        urlencoded.append('grant_type', 'client_credentials');
        urlencoded.append('client_id', clientid);
        urlencoded.append('client_secret', secret);
        urlencoded.append('resource', resource);

        var requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: urlencoded,
          redirect: 'follow',
        };

        const data = fetch(`https://login.microsoftonline.com/${tenantid}/oauth2/token`, requestOptions).json();
        expiry = data.expires_on;
        token = data.access_token;
      }
      proxyReq.setHeader('Authorization', `bearer ${token}`);
    },
  }),
);

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
