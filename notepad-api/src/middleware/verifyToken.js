import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({ error: "NO_TOKEN_PROVIDED"})
    
        //Verificar el token
        const decode =jwt.verify(token, process.env.SECRET_KEY.toString());
        req.user = decode
        next();
    } catch (err) {
        return res.status(403).json({ error: "INVALID_OR_EXPIRED_TOKEN"});
    }
    
}