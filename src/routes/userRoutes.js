
import { Router } from "express";
import { createUser, getUserById } from "../dao/MongoDB/Controllers/UserController.js";
import passport from "passport";

const userRoutes = Router();

userRoutes.post('/register', passport.authenticate('register'), createUser);
userRoutes.get('/:id', getUserById);

export default userRoutes;