import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { productSchema } from "../Models/Product.js";

export class ProductManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "products", productSchema);
    // Atributos propios
  }

  // Métodos Propios

  async addProduct(product) {
    if (
      !product.title ||
      !product.price ||
      !product.stock ||
      !product.description ||
      !product.code ||
      !product.status


    ) {
      throw new Error("All fields are required");
    }
    if (!/^[0-9]+$/.test(product.price)) {
      throw new Error("Price must be a number");
    }
    if (!/^[0-9]+$/.test(product.stock)) {
      throw new Error("Stock must be a number");
    }
    return await this.addElements([product]);
  }

  async getProducts() {
    return await this.getElements();
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    if (!/^[0-9]+$/.test(price)) {
      throw new Error("Price must be a number");
    }
    if (!/^[0-9]+$/.test(stock)) {
      throw new Error("Stock must be a number");
    }
    const updatedProduct = {
      title,
      price,
      stock,
      description,
      code
    };
    await this.updateElement(id, updatedProduct);
  }

  async deleteProduct(id) {
    await this.removeElement(id);
  }

  async getProductById(id) {
    return await this.getElementById(id);
  }
}
