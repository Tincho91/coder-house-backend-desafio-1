import { Router } from "express";
import ProductManager from "../controller/ProductManager.js";


const productRoutes = Router();
const productManager = new ProductManager("src/data/products.json");

productRoutes.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.send(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while getting the products" });
  }
});

productRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(id);
    if (!product) {
      res.status(404).send({ error: "Product not found" });
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while getting the product" });
  }
});

productRoutes.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.send(newProduct);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while adding the product" });
  }
});

productRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, code, stock } = req.body;
    await productManager.updateProduct(
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    res.send({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while updating the product" });
  }
});

productRoutes.delete("/:id", async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.id);
    if (!result) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the product" });
  }
});

export default productRoutes;
