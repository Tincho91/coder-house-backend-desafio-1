import ProductManager from "./ProductManager.js";

class CartManager {
  constructor(path) {
      this.path = path;
      this.carts = [];
      this.productManager = new ProductManager(path);
  }

  async createCart(userId) {
      const newCart = new Cart({ userId });
      return await newCart.save();
  }

  async getCart(cartId) {
      return await findById(cartId);
  }

  async addProductToCart(cartId, productId) {
      const product = await this.productManager.getProductById(productId);
      if (!product) {
          console.log('Product not found');
          return;
      }
      return await findByIdAndUpdate(cartId, {
          $push: { productIds: productId }
      }, { new: true });
  }

  async removeProductFromCart(cartId, productId) {
      return await findByIdAndUpdate(cartId, {
          $pull: { productIds: productId }
      }, { new: true });
  }

  async clearCart(cartId) {
      return await findByIdAndUpdate(cartId, {
          productIds: []
      }, { new: true });
  }
}

export default CartManager;