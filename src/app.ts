import * as http from 'node:http';
import { parseCensored, redact } from './utils.js';
import type { CensoredDocument } from './types.js';

const PORT = 8000;

http
  .createServer(async (req, res) => {
    if (req.method === 'POST') {
      if (req.url === '/redact') {
        try {
          let body = "";

          req.setEncoding('utf8');

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', () => {
            try {
              const { censored, text }: CensoredDocument = JSON.parse(body);
              const parsedCensored: string [] = parseCensored(censored);
              const redacted: string = redact(parsedCensored, text);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(redacted));
            } catch (er) {
              res.statusCode = 400;

              return res.end('Error');
            }
          });
        } catch {

        }
      }
      
      // if (req.url === '/unredact') {

      // }
    }
  })
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
