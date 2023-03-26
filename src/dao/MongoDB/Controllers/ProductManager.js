import { mongoDbManager } from "../../../database/mongoDbManager.js";
import { productSchema } from "../Models/Product.js";

export class ProductManagerMongoDB extends mongoDbManager {
  constructor() {
    super(process.env.MONGODBURL, "products", productSchema);
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.price ||
      !product.stock ||
      !product.description ||
      !product.category ||
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

  async getProducts(limit, page, sort, query) {
    const queryObject = query ? this.buildQueryObject(query) : {};
    const options = this.buildPaginationOptions(limit, page, sort);
    const products = await this.getElements(queryObject, options);
    const totalDocuments = await this.countElements(queryObject);
    return { products, totalDocuments };
  }

  buildQueryObject(query) {
    // Añade las condiciones de búsqueda según el tipo de elemento que se desee buscar
    const queryObject = {};
    if (query.category) queryObject.category = query.category;
    if (query.availability) queryObject.available = query.availability === 'true';
    return queryObject;
  }

  buildPaginationOptions(limit, page, sort) {
    const options = {
      limit: limit ? parseInt(limit) : 10,
      skip: (page ? parseInt(page) - 1 : 0) * (limit ? parseInt(limit) : 10),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
    };
    return options;
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
      category,
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
