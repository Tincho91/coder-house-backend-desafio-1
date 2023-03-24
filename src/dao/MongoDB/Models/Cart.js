import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { Schema } from "mongoose";

const cartSchema = new Schema({
  user: {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

export class CartManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "carts", cartSchema);
  }
  //Metodos Propios
}