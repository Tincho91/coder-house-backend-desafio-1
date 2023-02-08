import { Router } from 'express';
import ProductManager from '../managers/ProductManager';

const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get('/', (req, res) => {
  res.send(productManager.getAllProducts());
});

productsRouter.get('/:id', (req, res) => {
  const product = productManager.getProductById(req.params.id);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.send(product);
});

productsRouter.post('/', (req, res) => {
  const newProduct = productManager.addProduct(req.body);
  res.send(newProduct);
});

productsRouter.put('/:id', (req, res) => {
  const updatedProduct = productManager.updateProduct(req.params.id, req.body);
  if (!updatedProduct) {
    return res.status(404).send('Product not found');
  }
  res.send(updatedProduct);
});

productsRouter.delete('/:id', (req, res) => {
  const product = productManager.deleteProduct(req.params.id);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.send(product);
});

export default productsRouter;