import { Router } from "express";
import {
  getAllCarts,
  addCart,
  getCartById,
  updateCart,
  updateProductQuantity,
  deleteCart,
  deleteProductFromCart
} from "../dao/MongoDB/Controllers/CartManager.js";

const cartRoutes = Router();

cartRoutes.get("/", getAllCarts);
cartRoutes.post("/", addCart);
cartRoutes.get("/:cid", getCartById);
cartRoutes.put("/:cid", updateCart);
cartRoutes.put("/:cid/products/:pid", updateProductQuantity);
cartRoutes.delete("/:cid", deleteCart);
cartRoutes.delete("/:cid/products/:pid", deleteProductFromCart);

export default cartRoutes;