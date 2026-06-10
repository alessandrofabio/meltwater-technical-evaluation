import * as http from 'node:http';
import { parseCensored, redact } from './utils.js';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    if (req.url === '/redact') {
      let body = "";

      req.setEncoding('utf8');

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const { censored, text } = JSON.parse(body);
          const parsedCensored = parseCensored(censored);
          const redacted = redact(parsedCensored, text);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(redacted));
        } catch (er) {
          res.statusCode = 400;
          return res.end(`error: `);
        }
      });
    }
  }
});
  
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
