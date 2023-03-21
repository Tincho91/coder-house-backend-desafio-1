import ProductManager from "./ProductManager.js";

class CartManager {
  constructor(path) {
    this.productManager = new ProductManager(path);
    this.carts = [];
  }

  createCart(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const cart = {
      userId,
      cartId: this.generateID(),
      products: [],
    };
    this.carts.push(cart);
    return cart;
  }

  generateID() {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 10; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  }

  async addToCart(userId, productId, quantity) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!/^[0-9]+$/.test(quantity)) {
      throw new Error("Quantity must be a number");
    }
    const product = await this.productManager.getProductById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.stock < quantity) {
      throw new Error("Not enough stock");
    }

    const userCartIndex = this.carts.findIndex(
      (cart) => cart.userId === userId
    );
    let userCart;
    if (userCartIndex === -1) {
      userCart = this.createCart(userId);
    } else {
      userCart = this.carts[userCartIndex];
    }
    const cartProductIndex = userCart.products.findIndex(
      (p) => p.ProductId === productId
    );
    if (cartProductIndex !== -1) {
      userCart.products[cartProductIndex].quantity += quantity;
    } else {
      userCart.products.push({ ProductId: productId, quantity });
    }
    product.stock -= quantity;
    await this.productManager.updateProduct(
      product.id,
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.stock
    );
    return { userId, cartId: userCart.cartId, product, quantity };
  }

  async removeFromCart(userId, productId, quantity) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!/^[0-9]+$/.test(quantity)) {
      throw new Error("Quantity must be a number");
    }
    const userCartIndex = this.carts.findIndex(
      (cart) => cart.userId === userId
    );
    if (userCartIndex === -1) {
      throw new Error("User not found");
    }
    const userCart = this.carts[userCartIndex];
    const product = await this.productManager.getProductById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const cartProductIndex = this.cart.findIndex(
      (p) => p.product.id === product.id
    );
    if (cartProductIndex === -1) {
      throw new Error("Product not in cart");
    }
    if (userCart.products[cartProductIndex].quantity < quantity) {
      throw new Error("Not enough quantity in cart");
    }
    userCart.products[cartProductIndex].quantity -= quantity;
    product.stock += quantity;
    await this.productManager.updateProduct(
      product.id,
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.stock
    );
    if (userCart.products[cartProductIndex].quantity === 0) {
      userCart.products.splice(cartProductIndex, 1);
    }
    return userCart;
  }

  getCart(userId) {
    const userCart = this.carts.find((c) => c.userId === userId);
    if (!userCart) {
      throw new Error("User not found");
    }
    return userCart;
  }
}

export default CartManager;
