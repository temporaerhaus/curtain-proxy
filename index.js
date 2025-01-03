require('dotenv').config();

const http = require('http');
const httpProxy = require('http-proxy');

(async () => {
  const proxies = {};

  try {
    const proxy = httpProxy.createProxyServer({});

    for (const key of Object.keys(process.env).filter(e => e.startsWith('CURTAIN_URL_'))) {
      proxies[process.env[`CURTAIN_PATH_${key.slice(12)}`]] = {
        target: process.env[key],
        transformers: Object.keys(process.env)
          .sort()
          .filter(e => e.startsWith(`CURTAIN_REGEX_${key.slice(12)}`))
          .map(k => {
            const regex = process.env[k].split('/');
            return [new RegExp(regex[1], regex[3]), regex[2]];
          })
      };
    }

    const server = http.createServer((req, res) => {
      if (proxies[req.url]) {
        proxy.web(req, res, {
          target: proxies[req.url].target,
          selfHandleResponse: true,
          changeOrigin: true,
          ignorePath: true
        }, (e) => {
          console.log('hmm', e);
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not Found!');
        res.end();
      }
    });

    proxy.on('proxyRes', (proxyRes, req, res) => {
      const chunks = [];
      proxyRes.on('data', (chunk) => chunks.push(chunk));
      proxyRes.on('end', () => {
        let body = Buffer.concat(chunks).toString();
        for (const t of proxies[req.url].transformers) {
          body = body.replace(t[0], t[1]);
        }

        for (const [key, value] of Object.entries(proxyRes.getHeaders())) {
          res.setHeader(key, value);
        }
        res.end(body);
      });
    });

    console.log('listening on port 5050');
    server.listen(5050);
  } catch (e) {
    console.log(e);
  }
})();
