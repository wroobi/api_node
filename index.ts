import { IncomingMessage, ServerResponse } from "http";

const http = require("node:http");

const hostname: string = "127.0.0.1";
const port: number = 3000;

const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, World!\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
