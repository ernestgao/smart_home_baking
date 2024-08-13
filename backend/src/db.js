import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://tedgao2003:PMqryG2pFEJ0bkft@cluster0.ugjaoiu.mongodb.net/";
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
}

export default {
    client,
    connectDB
};