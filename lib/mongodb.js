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
            bufferCommands: false
        }).then((mongoose) => {
            console.log("Mongodb has been connected Succesfully!")
            return mongoose
        }).catch((error) => console.log('Error:', error.message))
    }

    cached.conn = await cached.promise;
    return cached.conn
}