import passport from "passport";

export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) {
                return next(error)
            }
            if(!user) {
                return document(null, false, {message: "User not found"})
            }

            req.user = user
            next()
        }) (req, res, next)
    }
}


export const authorization = (rol) => {
    return async(req, res, next) => {
        if(!req.user) {
            return res.status(401).send({ message: "User not logged in"})
        }
        if(req.user.user[0].rol != rol){
            res.status(403).send({ error: "User not valid"}) 
        }
    }
}