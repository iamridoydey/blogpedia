import mongoose from "mongoose";

const MONGODB_URI =  process.env.MONGODB_URI || "";

if (!MONGODB_URI){
  throw new Error("Please define the MONGODB_URI environment variable in your .env file.");
}

let cachedConnection: mongoose.Mongoose | null = null;

async function dbConnect(){
  if (cachedConnection){
    return cachedConnection;
  }

  try{
    cachedConnection = await mongoose.connect(MONGODB_URI);
    return cachedConnection;
  } catch (error){
    throw error;
  }
}


export default dbConnect;