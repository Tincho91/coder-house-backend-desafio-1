import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { cartSchema } from "../Models/Cart.js";

export class CartManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "carts", cartSchema);
  }

  async getAllCarts() {
    try {
      const carts = await this.model.find().populate("products.productId");
      return carts;
    } catch (error) {
      console.log("Error fetching carts", error);
    }
  }

  async addCart(cartData) {
    try {
      const newCart = new this.model(cartData);
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while creating the cart");
    }
  }

  async updateCart(cid, products) {
    await this.updateOne({ _id: cid }, { $set: { products: products } });
  }

  async updateProductQuantity(cid, pid, quantity) {
    await this.updateOne({ _id: cid, "products.product": pid }, { $set: { "products.$.quantity": quantity } });
  }

  async deleteCart(cid) {
    await this.updateOne({ _id: cid }, { $set: { products: [] } });
  }

  async deleteProductFromCart(cid, pid) {
    await this.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
  }
}