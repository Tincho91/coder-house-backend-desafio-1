import { CartManagerMongoDB } from "../Models/Cart.js";

const cartManager = new CartManagerMongoDB();

export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartManager.getElements();
    res.render("carts", { carts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching the carts" });
  }
};

export const addCart = async (req, res) => {
  try {
    const newCart = await cartManager.addElements([req.body]);
    res.status(201).send({ message: "Cart created successfully", cart: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while creating the cart" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getElementById(cartId);

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    const total = cart.products.reduce((sum, product) => sum + product.price, 0);

    res.render("cart", {
      userEmail: cart.user.email,
      cartProducts: cart.products,
      total: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while getting the cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;
    await cartManager.updateElement(cid, { products });
    res.send({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while updating the cart" });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.removeElement(cid);
    res.send({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while clearing the cart" });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartManager.updateProductQuantity(cid, pid, quantity);
    res.send({ message: "Product quantity updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while updating the product quantity" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.deleteProductFromCart(cid, pid);
    res.send({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while removing the product from the cart" });
  }
};