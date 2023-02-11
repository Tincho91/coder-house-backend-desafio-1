import { promises as fs } from "fs";

class CartManager {
  constructor(pm) {
    this.carts = [];
    this.path = `src/data/carts.json`;
    this.productManager = pm;
  }

  async init() {
    this.carts = await this.readFromFile();
  }

  async createCart(userId) {
    const cart = {
      id: this.generateId(),
      userId: userId,
      products: [],
    };

    this.carts.push(cart);
    await this.writeToFile();

    return cart;
  }

  async getCart(cartId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      throw new Error(`Cart with id '${cartId}' not found.`);
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const product = await this.productManager.getProductById(productId);
    if (!product) {
      console.log("Product not found");
      return;
    }
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      throw new Error(`Cart with id '${cartId}' not found.`);
    }
    let productInCart = cart.products.find((p) => p.product === productId);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await this.writeToFile();

    return cart;
  }

  async writeToFile() {
    await fs.writeFile(this.path, JSON.stringify(this.carts));
  }
  
  async readFromFile() {
    try {
      const file = await fs.readFile(this.path, "utf8");
      return JSON.parse(file);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  generateId() {
    let id;
    do {
      id = Math.floor(Math.random() * 100000000);
    } while (this.carts.find((cart) => cart.id === id));
    return id;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      throw new Error(`Cart with id '${cartId}' not found.`);
    }
    cart.products = cart.products.filter((p) => p.product !== productId);
    await this.writeToFile();
    return cart;
  }
}

export default CartManager;
