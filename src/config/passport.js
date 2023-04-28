import passport from 'passport';
import { userManager } from '../dao/MongoDB/Controllers/SessionController.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import GitHubStrategy from 'passport-github2';
import jwtStrategy from "passport-jwt";

const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    //Definir donde se aplican estrategias

    const cookieExtractor = req => {
        //Si existen las cookies, asigno mi cookie en específico sino asigno null
        const token = (req && req.cookies) ? req.cookies('jwtCookies') : null;
        return token;
    };

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEY_JWT
    }, async(jwtPayload, done) => {
        try {
            const user = await userManager.getElementById(jwtPayload._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    }));

    //Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = userManager.getElementById(id);
        done(null, user);
    })

    passport.use('github', new GitHubStrategy ({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL

    }, async(accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const user = await userManager.getElementByEmail(profile._json.email)
            if(user) {
                done(null, user);
            } else {
                const userCreated = await userManager.addElements([{
                    firstName : profile._json.name,
                    lastName : '', //Github no cuenta con apellido
                    email : profile._json.email,
                    age : '', //Tampoco edad
                    password : '' //No se asigna password porque github ya la ofrece
                }])
                done(null, userCreated)
            }
        } catch {
            return done(error);
        }
    }))
}

export default initializePassport;