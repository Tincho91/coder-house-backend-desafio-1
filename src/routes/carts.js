import { Router } from 'express';
import CartManager from '../controller/CartManager.js';

const cartManager = new CartManager();
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

cartRoutes.post('/:cartId/products', async (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;
  try {
    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.send(updatedCart);
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