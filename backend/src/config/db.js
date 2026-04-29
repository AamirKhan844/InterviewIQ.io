import mongoose from "mongoose";
export const dbConnect = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "IQInterview_IO",
    });
    console.log(`connected successfully to ${db.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
