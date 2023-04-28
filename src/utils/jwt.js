import jwt from "jsonwebtoken";

export const generateToken = (user) => { 
    // Crea un token JWT usando 'user', la clave privada y establece su expiración en 12 horas.
    const token = jwt.sign({user}, process.env.PRIVATE_KEY_JWT, {expiresIn: '12h'});
    return token;
}

export const authToken = (req, res, next) => {
    // Consulto Header
    const authHeader = req.headers.authorization
    if (!authHeader) { // Entra si el token está vencido o no existe.
        return res.status(401).send({error: 'Usuario no Autenticado'});
    }

    const token = authHeader.split(' ')[1];
    jwt.sign({token}, process.env.PRIVATE_KEY_JWT, (error, credentials) => {
        if (error) {
            return res.status(403).send({error: 'Usuario no Autenticado'});
        }
        req.user = credentials.user;
        next();
    });
}