import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { Schema } from "mongoose";

export const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
});

export class UserManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "users", userSchema);
  }
}