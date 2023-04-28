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
    index: true,
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
    default: "user",
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "carts",
    required: true, 
  },
});

export class UserManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "users", userSchema);
  }

  async getElementByEmail(email) {
    super.setConnection();
    try {
      return await this.model.findOne({ email: email });
    } catch (error) {
      return error;
    }
  }
}
