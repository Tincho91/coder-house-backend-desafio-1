import { Router } from 'express';
import ProductManager from '../controller/ProductManager.js';

const productRoutes = Router();
const productManager = new ProductManager("src/data/pruducts.json");

productRoutes.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while getting the products" });
  }
});

productRoutes.get('/:id', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while getting the product" });
  }
});

productRoutes.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.send(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while adding the product" });
  }
});

productRoutes.put('/:id', async (req, res) => {
  try {
    try {
      const updatedProduct = await productManager.updateProduct(req.params.id, req.body);
      if (!updatedProduct) {
        return res.status(404).send({ error: "Product not found" });
      }
      res.send(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while updating the product: " + error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while updating the product" });
  }
});

productRoutes.delete('/:id', async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.id);
    if (!result) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while deleting the product" });
  }
});

export default productRoutes;