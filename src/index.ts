import { IncomingMessage, ServerResponse } from "http";
import { MongoClient } from "mongodb";
import { profilesRouter, fetchProfiles } from "./profiles";
import url from "node:url";
const http = require("node:http");
const hostname: string = "127.0.0.1";
const port: number = 3000;
import { URL } from "url";

// Connection URL
const dbUrl = "mongodb://localhost:27017";

// Create a new MongoClient
const client = new MongoClient(dbUrl);

const server = http
  .createServer
  // async (req: IncomingMessage, res: ServerResponse) => {
  // if (req.url === "/health") {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "text/plain");
  //   res.end("OK\n");
  // } else if (req.url === "/profiles" && req.method === "GET") {
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "application/json");
  //   const profiles = await fetchProfiles(client);
  //   res.end(profiles);
  //   // }
  //   // else if (req.url === "/profiles" && req.method === "POST") {
  //   //   res.statusCode = 200;
  //   //   res.setHeader("Content-Type", "application/json");
  //   //   const profiles = await fetchProfiles(client);
  //   //   res.end(profiles);
  // } else {
  //   res.statusCode = 404;
  //   res.setHeader("Content-Type", "text/plain");
  //   res.end("Dead end\n");
  // }
  // }
  ();

server.on("request", async (req: IncomingMessage, res: ServerResponse) => {
  const { method, headers } = req;

  // const parsedUrl = url.parse(reqUrl, true);
  // const queryString = parsedUrl.query;

  const profilesRoutes = profilesRouter;

  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
  const requestedController = profilesRoutes[pathname];
  // console.log("req.body", req.body);

  let requestBody = Buffer.from([]);

  req.on("data", (chunk) => {
    requestBody = Buffer.concat([requestBody, chunk]);
  });
  req.on("end", async () => {
    const body = await JSON.parse(requestBody.toString());
    console.log("body", body);

    const respondFromController = await requestedController(
      { pathname, method, headers },
      client
    );

    const { contentType, statusCode, payload } = respondFromController;

    res.setHeader("Content-Type", contentType);
    res.writeHead(statusCode);
    res.end(payload);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
