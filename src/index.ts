import { IncomingMessage, ServerResponse } from "http";
import { MongoClient, MongoClientOptions } from "mongodb";

const http = require("node:http");

const hostname: string = "127.0.0.1";
const port: number = 3000;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "test";

// Create a new MongoClient
const client = new MongoClient(url);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");

    const profiles = await client
      .db("test")
      .collection("profiles")
      .find()
      .toArray();
    console.log("profiles", profiles);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/health") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("OK\n");
    } else if (req.url === "/users") {
      res.statusCode = 501;
      res.setHeader("Content-Type", "text/plain");
      res.end("Not implemented\n");
    }
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Dead end\n");
  }
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
