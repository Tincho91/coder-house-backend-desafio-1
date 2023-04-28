import { Router } from "express";
import { getSession, testLogin, destroySession, register, home, signIn, signUp, getCurrentUser } from "../dao/MongoDB/Controllers/SessionController.js";
import passport from "passport";

const sessionRoutes = Router();

sessionRoutes.get('/', getSession);
sessionRoutes.get('/home', home);
sessionRoutes.get('/logout', destroySession);

sessionRoutes.get('/login', signIn);
sessionRoutes.post('/login', passport.authenticate('login'), testLogin);

sessionRoutes.get('/register', signUp);
sessionRoutes.post('/register', register);

sessionRoutes.get('/jwtTest', passport.authenticate('jwt', {session: false}, (req,res) => {
 res.send(req.user)
}))

sessionRoutes.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser);


export default sessionRoutes;