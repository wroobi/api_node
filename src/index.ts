import { IncomingMessage, ServerResponse } from "http";
import { MongoClient } from "mongodb";
import { profilesRouter } from "./profiles";
const http = require("node:http");
const hostname: string = "127.0.0.1";
const port: number = 3000;

// Connection URL
const dbUrl = "mongodb://localhost:27017";

// Create a new MongoClient
const client = new MongoClient(dbUrl);

const server = http.createServer();

server.on("request", async (req: IncomingMessage, res: ServerResponse) => {
  let body = Buffer.from([]);
  req.on("data", (chunk) => {
    body = Buffer.concat([body, chunk]);
  });
  req.on("end", async () => {
    const respondFromController = await profilesRouter(req, client, body);

    const { contentType, statusCode, payload } = respondFromController;

    res.setHeader("Content-Type", contentType);
    res.writeHead(statusCode);
    res.write(payload);
    res.end();
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
