import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this environment variable is set

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default client;
