import { Router } from "express";
import cartRoutes from "./cartRoutes.js";
import chatRoutes from "./chatRoutes.js";
import productRoutes from "./productRoutes.js";
import sessionRoutes from "./sessionRoutes.js";
import userRoutes from "./userRoutes.js";
import githubRoutes from "./githubRoutes.js";


const router = Router();

router.use("/products", productRoutes);
router.use('/user', sessionRoutes);
router.use('/api/chat', chatRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/session', sessionRoutes);
router.use("/api/users", userRoutes);
router.use("/session", githubRoutes);
router.use('*', (req, res) => {
    res.status(404).send({error: "Ruta no encontrada"})
});

export default router;