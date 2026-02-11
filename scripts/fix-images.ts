
import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGO_DB = process.env.MONGO_DB || 'Buddha';

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set in .env file');
    process.exit(1);
}

const fixes = [
    {
        name: 'Rode Wireless GO II',
        image: 'https://images.unsplash.com/photo-1590611936760-eeb9f5978ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        name: 'Schoeps CMIT 5U',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
];

async function fixImages() {
    const client = new MongoClient(MONGODB_URI!, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        tls: true,
        tlsAllowInvalidCertificates: true,
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(MONGO_DB);
        const collection = db.collection('products');

        for (const fix of fixes) {
            const result = await collection.updateOne(
                { name: fix.name },
                { $set: { image: fix.image } }
            );

            if (result.matchedCount > 0) {
                console.log(`Updated image for ${fix.name}`);
            } else {
                console.log(`Product not found: ${fix.name}`);
            }
        }

    } catch (error) {
        console.error('Error fixing images:', error);
    } finally {
        await client.close();
    }
}

fixImages();
