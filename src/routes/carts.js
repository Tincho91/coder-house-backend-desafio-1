import { Router } from 'express';
import CartManager from '../controller/CartManager.js';
import ProductManager from '../controller/ProductManager.js';

const pm = new ProductManager('src/data/products.json');
const cartManager = new CartManager('src/data/products.json', pm);
const cartRoutes = Router();

cartRoutes.get('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartManager.getCart(cartId);
    res.send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

cartRoutes.post('/', async (req, res) => {
  const products = req.body;
  try {
    const userId = req.body.userId;
    const cart = await cartManager.createCart(userId);
    res.send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

cartRoutes.put('/:cartId/products/:productId', async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;
  try {
    const updatedCart = await cartManager.updateProductInCart(cartId, productId, quantity);
    res.send(updatedCart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

cartRoutes.delete('/:cartId/products/:productId', async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
    res.send(updatedCart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default cartRoutes;