import Cart, { findById, findByIdAndUpdate } from '../models/Cart';

class CartManager {

    constructor(path) {
        this.path = path;
        this.carts = [];
    }

  async createCart(userId) {
    const newCart = new Cart({ userId });
    return await newCart.save();
  }

  async getCart(cartId) {
    return await findById(cartId);
  }

  async addProductToCart(cartId, productId) {
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