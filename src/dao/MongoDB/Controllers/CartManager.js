import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { cartSchema } from "./cartSchema.js";

export class CartManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "carts", cartSchema);
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