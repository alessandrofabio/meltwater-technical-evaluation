import * as http from 'node:http';
import { getRequestBody, parseKeywords, redact, unredact } from './utils.js';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    if (req.url === '/redact') {
      try {
        const body = await getRequestBody(req);
        const { keywords, text } = JSON.parse(body);

        const parsedKeywords = parseKeywords(keywords);
        const { redactedText, key } = redact(parsedKeywords, text);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ redactedText, key }));
      } catch (er) {
        const message = er instanceof Error ? er.message : 'Invalid request';
        
        res.statusCode = 400;
        return res.end(`Error: ${message}`);
      }
    }

    if (req.url === '/unredact') {
      try {
        const body = await getRequestBody(req);
        const { key, text } = JSON.parse(body);

        const originalText = unredact(key, text);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(originalText));
      } catch (er) {
        const message = er instanceof Error ? er.message : 'Invalid request';
        
        res.statusCode = 400;
        return res.end(`Error: ${message}`);
      }
    }
  }
});
  
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
