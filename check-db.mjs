import { connectToDatabase } from "./lib/mongodb.js";
import { Category } from "./models/Category.js";
import mongoose from "mongoose";

async function check() {
  try {
    await connectToDatabase();
    console.log("Connected to DB");
    const count = await Category.countDocuments();
    console.log("Total categories:", count);
    const all = await Category.find().lean();
    console.log("IDs in DB:", all.map(c => c._id.toString()));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
