import { Router } from "express";
import { ProductManagerMongoDB } from "../dao/MongoDB/Controllers/ProductManager.js";


const productRoutes = Router();
const productManager = new ProductManagerMongoDB();

productRoutes.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category, availability } = req.query;
    const query = { category, availability };
    const { products, totalDocuments } = await productManager.getProducts(limit, page, sort, query);

    const totalPages = Math.ceil(totalDocuments / (limit ? parseInt(limit) : 10));
    const currentPage = page ? parseInt(page) : 1;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;
    const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}` : null;

    res.render("products", {
      products,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while getting the products" });
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
