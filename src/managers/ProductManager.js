import { promises as fs } from "fs";

class ProductManager {

  constructor(path) {
    this.path = path;
    this.products = [];
  }

  generateID() {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 5; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("All fields are required");
    }
    if (!/^[0-9]+$/.test(product.price)) {
      console.log("Price must be a number");
    }
    if (!/^[0-9]+$/.test(product.stock)) {
      console.log("Stock must be a number");
    }
    let products = await this.getProducts();
    if (products.find((p) => p.code === product.code)) {
      console.log("Code already exists");
    }
    product.id = this.generateID();
    products.push(product);
    await this.saveProducts(products);
  }

  async getProducts() {
    try {
      let products = JSON.parse(await fs.readFile(this.path, "utf8"));
      return products;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(
        this.path,
        JSON.stringify(products, null, 4),
        "utf8"
      );
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    if (!/^[0-9]+$/.test(price)) {
      console.log("Price must be a number");
    }
    if (!/^[0-9]+$/.test(stock)) {
      console.log("Stock must be a number");
    }
    let products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      console.log("Product not found");
      return;
    }
    products[productIndex].title = title;
    products[productIndex].description = description;
    products[productIndex].price = price;
    products[productIndex].thumbnail = thumbnail;
    products[productIndex].code = code;
    products[productIndex].stock = stock;
    console.log("Product updated successfully");
    await this.saveProducts(products);
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await this.saveProducts(products);
      console.log("Product deleted");
    } else {
      console.log("Product not found");
    }
  }

  async getProductById(id) {
    let products = await this.getProducts();
    return products.find((p) => p.id === id);
  }
}

export default ProductManager;
