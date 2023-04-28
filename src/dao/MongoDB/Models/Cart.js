import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { Schema, model } from "mongoose";
import { productSchema } from "./Product.js";

// Create the Product model
const ProductModel = model("Product", productSchema);

export const cartSchema = new Schema({
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

  async getElements() {
    try {
      const carts = await this.model.find().populate('products.productId');
      return carts;
    } catch (error) {
      console.error("Error fetching carts", error);
      throw error;
    }
  }

  async createEmptyCart(userEmail) {
    try {
      const newCart = new this.model({ user: { email: userEmail }, products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error creating empty cart", error);
      throw error;
    }
  }
}