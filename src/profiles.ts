import { MongoClient, ObjectId } from "mongodb";
import { IncomingMessage, ServerResponse } from "http";
import { type } from "os";

// Database Name
const dbName = "test";

async function fetchProfiles(client: MongoClient) {
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
    return JSON.stringify({ profiles: profiles }); // convert the result to JSON string
  } catch (err) {
    console.error("Failed to fetch profiles:", err);
    throw err;
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

async function fetchProfile(client: MongoClient, id: string) {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    const collection = db.collection("profiles");
    const project = {
      _id: 1,
      "name.first_name": 1,
      "name.middle_name": 1,
      "name.last_name": 1,
      email: 1,
      phone_number: 1,
      gender: 1,
      is_deleted: 1,
    };

    const profile = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: project }
    );

    return JSON.stringify(profile); // convert the result to JSON string
  } catch (err) {
    console.error("Failed to fetch profile:", err);
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

export const profilesRouter = async (
  req: IncomingMessage,
  client: MongoClient
) => {
  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);

  const routeName = pathname.match(/\/profiles\/([0-9]+)/)
    ? "/profiles/:id"
    : pathname;

  switch (routeName) {
    case "/profiles/:id":
      const id = pathname.split("/")[2];

      const profile = await fetchProfile(client, id);
      return {
        statusCode: 200,
        contentType: "application/json",
        payload: profile,
      };

    default:
      const payload = JSON.stringify({ message: "dead end" });
      return {
        statusCode: 404,
        contentType: "application/json",
        payload,
      };
  }
};
