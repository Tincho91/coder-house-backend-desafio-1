import { Router } from "express";
import { CartManagerMongoDB } from "../dao/MongoDB/Controllers/CartManager.js";

const cartRoutes = Router();
const cartManager = new CartManagerMongoDB();

cartRoutes.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.render("carts", { carts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching the carts" });
  }
});

cartRoutes.post("/", async (req, res) => {
  try {
    const cartData = req.body;
    const newCart = await cartManager.addCart(cartData);
    res.status(201).send({ message: "Cart created successfully", cart: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while creating the cart" });
  }
});

cartRoutes.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;
    await cartManager.updateCart(cid, products);
    res.send({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while updating the cart" });
  }
});

cartRoutes.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartManager.updateProductQuantity(cid, pid, quantity);
    res.send({ message: "Product quantity updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while updating the product quantity" });
  }
});

cartRoutes.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.deleteCart(cid);
    res.send({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while clearing the cart" });
  }
});

cartRoutes.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.deleteProductFromCart(cid, pid);
    res.send({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while removing the product from the cart" });
  }
});

export default cartRoutes;