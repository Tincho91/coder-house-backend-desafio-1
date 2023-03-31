import { Router } from "express";
import { getSession, testLogin, destroySession, register, home } from "../dao/MongoDB/Controllers/SessionController.js";


const sessionRoutes = Router();

sessionRoutes.get('/', getSession)
sessionRoutes.post('/login', testLogin)
sessionRoutes.get('/home', home)
sessionRoutes.get('/logout', destroySession)
sessionRoutes.get('/register', register)

export default sessionRoutes;