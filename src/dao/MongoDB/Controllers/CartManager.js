import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { cartSchema } from "../Models/Cart.js";
import { ProductManagerMongoDB } from "../Models/Product.js";

export class CartManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "carts", cartSchema);
    this.productManager = new ProductManagerMongoDB();
  }

  async getProductByCode(res, code) {
    try {
      const product = await this.productManager.model.findOne({ code: code });
      return product;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while getting the product" });
    }
  }

  async getAllCarts(res) {
    try {
      const carts = await this.model.find().populate("products.productId");
      return carts;
    } catch (error) {
      console.log("Error fetching carts", error);
      res.status(500).json({ message: "An error occurred while fetching carts" });
    }
  }

  async getCartById(res, cartId) {
    try {
      const cart = await this.model.findById(cartId).populate("products.productId");
      return cart;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while getting the cart" });
    }
  }

  async addCart(res) {
    try {
      const newCart = new this.model({
        user: {
          email: `guest${Date.now()}@example.com`,
        },
        products: [],
      });
  
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the cart" });
    }
  }

  async updateCart(res, cid, products) {
    try {
      await this.updateOne({ _id: cid }, { $set: { products: products } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the cart" });
    }
  }

  async updateProductQuantity(res, cid, pid, quantity) {
    try {
      await this.updateOne({ _id: cid, "products.product": pid }, { $set: { "products.$.quantity": quantity } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the product quantity" });
    }
  }

  async deleteCart(res, cid) {
    try {
      await this.updateOne({ _id: cid }, { $set: { products: [] } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the cart" });
    }
  }

  async deleteProductFromCart(res, cid, pid) {
    try {
      await this.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the product from the cart" });
    }
  }
}