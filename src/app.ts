import * as http from 'node:http';

const port = process.env.PORT ?? 3000;

const server = http.createServer();

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
