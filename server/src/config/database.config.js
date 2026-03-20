import mongoose from "mongoose";
import env from '#/config/environment.config.js'


const connectDB = async () => {
  const uri = env.MONGO_URI;
  const dbName = env.MONGO_DB_NAME;

  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  if (!dbName) {
    throw new Error("MONGO_DB_NAME is not set");
  }

  try {
    await mongoose.connect(uri, {
      dbName:dbName,
    });

    console.log(`MongoDB connected successfully to database: ${dbName}`);
  } catch (error) {
    const message = String(error?.message || "");

    if (message.toLowerCase().includes("authentication failed")) {
      throw new Error(
        "MongoDB authentication failed. Check username/password in MONGO_URI and URL-encode special characters."
      );
    }

    if (message.toLowerCase().includes("querysrv")) {
      throw new Error(
        "MongoDB SRV lookup failed. Check internet/DNS access and Atlas hostname in MONGO_URI."
      );
    }

    throw error;
  }
};

export default connectDB;
