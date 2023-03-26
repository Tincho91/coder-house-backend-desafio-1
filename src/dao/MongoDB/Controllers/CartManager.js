import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { cartSchema } from "../Models/Cart.js";
import { ProductManagerMongoDB } from "../Models/Product.js";

export class CartManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "carts", cartSchema);
    this.productManager = new ProductManagerMongoDB();
  }

  async getProductByCode(code) {
    try {
      const product = await this.productManager.model.findOne({ code: code });
      return product;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while getting the product");
    }
  }

  async getAllCarts() {
    try {
      const carts = await this.model.find().populate("products.productId");
      return carts;
    } catch (error) {
      console.log("Error fetching carts", error);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await this.model.findById(cartId).populate("products.productId");
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while getting the cart");
    }
  }

  async addCart(cartData) {
    try {
      const populatedProducts = [];

      for (const product of cartData.products) {
        const fetchedProduct = await this.getProductByCode(product.code);

        if (!fetchedProduct) {
          throw new Error(`Product with code ${product.code} not found`);
        }

        populatedProducts.push({
          productId: fetchedProduct._id,
          code: fetchedProduct.code,
          quantity: product.quantity,
          price: fetchedProduct.price * product.quantity,
        });
      }

      const newCart = new this.model({
        user: cartData.user,
        products: populatedProducts,
      });

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