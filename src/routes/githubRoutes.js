import { Router } from "express";
import passport from "passport";

const githubRoutes = Router();

githubRoutes.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {})

githubRoutes.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
})


export default githubRoutes;