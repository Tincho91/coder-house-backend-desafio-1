import { Router } from "express";
import { getSession, testLogin, destroySession, register, home, signIn, signUp } from "../dao/MongoDB/Controllers/SessionController.js";


const sessionRoutes = Router();

sessionRoutes.get('/', getSession);
sessionRoutes.get('/home', home);
sessionRoutes.get('/logout', destroySession);

sessionRoutes.get('/login', signIn);
sessionRoutes.post('/login', testLogin);

sessionRoutes.get('/register', signUp);
sessionRoutes.post('/register', register);



export default sessionRoutes;