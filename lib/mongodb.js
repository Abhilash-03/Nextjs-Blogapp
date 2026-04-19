import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || '';

if(!MONGO_URI){
    throw new Error("Please define the MONGO_URI env variable inside .env");
}

let cached = global.mongoose || {conn: null, promise: null};

export async function connectToDB() {
    if(cached.conn) return cached.conn

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            dbName: 'bloxDB',
        }).then((mongoose) => {
            console.log("Mongodb has been connected Succesfully!")
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error('MongoDB connection error:', error);
        throw error;
    }

    global.mongoose = cached;
    return cached.conn
}