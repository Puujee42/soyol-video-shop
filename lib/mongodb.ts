import { MongoClient, Db, Collection, Document } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGO_DB = process.env.MONGO_DB || 'Buddha';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

const globalForMongo = globalThis as unknown as {
  _mongoClient: MongoClient | undefined;
  _mongoClientPromise: Promise<MongoClient> | undefined;
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export { clientPromise };

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(MONGO_DB);
}

export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
