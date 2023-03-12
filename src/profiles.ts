import { MongoClient, ObjectId } from "mongodb";
import { IncomingMessage, ServerResponse } from "http";

// Database Name
const dbName = "test";

export async function fetchProfiles(client: MongoClient) {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("profiles");

    const project = {
      _id: 1,
      name: 1,
      email: 1,
      phone_number: 1,
      gender: 1,
      is_deleted: 1,
    };

    const profiles = await collection.find().project(project).toArray();
    return JSON.stringify(profiles); // convert the result to JSON string
  } catch (err) {
    console.error("Failed to fetch profiles:", err);
    throw err;
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}
interface Profile {
  name: string;
}
export async function createProfile(client: MongoClient, profile: Profile) {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("profiles");

    const { insertedId } = await collection.insertOne(profile);
    return JSON.stringify(insertedId); // convert the result to JSON string
  } catch (err) {
    console.error("Failed to create profile:", err);
    throw err;
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

export async function deleteProfile(
  client: MongoClient,
  { id }: { id: ObjectId }
) {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("profiles");

    const result = await collection.deleteOne({ _id: id });
    return JSON.stringify(result.deletedCount); // convert the result to JSON string
  } catch (err) {
    console.error("Failed to delete profile:", err);
    throw err;
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}
interface ProfilesRouter {
  [key: string]: Function;
  "/profiles": Function;
  "/notFound": Function;
}

interface reqData {
  method: IncomingMessage["method"];
  pathname: string;
  headers: object;
}

export const profilesRouter: ProfilesRouter = {
  "/profiles": async (data: reqData, client: MongoClient) => {
    switch (data.method) {
      case "GET":
        const profiles = await fetchProfiles(client);
        return {
          statusCode: 200,
          contentType: "application/json",
          payload: profiles,
        };
      case "POST":
        const profile = await createProfile(client, { name: "zorro" });
        return {
          statusCode: 200,
          contentType: "application/json",
          payload: profile,
        };
    }
  },
  "/notFound": () => {
    const payload = JSON.stringify({ message: "dead end" });
    return {
      statusCode: 404,
      contentType: "application/json",
      payload,
    };
  },
};
