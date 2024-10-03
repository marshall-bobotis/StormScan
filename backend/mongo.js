"use strict";

const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable in the .env file");
}

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let client;
let clientPromise;

client = new MongoClient(MONGO_URI, options);
clientPromise = client.connect();

/**
 *  gets database instance
 * @returns {Promise<MongoClient.db>}
 */
const getDb = async () => {
    try {
        await clientPromise;
        return client.db("StormScan");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
};

module.exports = { getDb };