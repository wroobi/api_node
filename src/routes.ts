import { IncomingMessage, ServerResponse } from "http";
import { fetchProfiles } from "./profiles";
import { MongoClient } from "mongodb";

export const routes = (
  client: MongoClient,
  req: IncomingMessage,
  res: ServerResponse
) => {
  switch (req.url) {
    case "/":
      async (_req: IncomingMessage, res: ServerResponse) => {
        res.statusCode = 200;
        res.end("Welcome to my API!");
        console.log("routes hello");
      };
      break;
    case "/profiles": {
      console.log("routes profiles");
      async (req: IncomingMessage, res: ServerResponse) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        const profiles = await fetchProfiles(client);
        res.end(profiles);
      };
    }
    //   POST: (req: IncomingMessage, res: ServerResponse) => {
    //     // Create profile logic here
    //   },
    // },
    // '/profiles/:id': {
    //   GET: (req: IncomingMessage, res: ServerResponse, params: any) => {
    //     // Get profile by id logic here
    //   },
    //   PUT: (req, res, params) => {
    //     // Update profile by id logic here
    //   },
    //   DELETE: (req, res, params) => {
    //     // Delete profile by id logic here
    //   },
    // },
  }
};
