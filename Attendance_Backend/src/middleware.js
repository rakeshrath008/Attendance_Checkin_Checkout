const jwt = require('jsonwebtoken');
const secretKey = process.env.Secret_Key;

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.query.token || req.cookies.token;
     const tokenSplit = token.split(" ")[1];
    if (!tokenSplit) {
        return res.status(401).json({ message: 'Token is required' });
    }
    jwt.verify(tokenSplit, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
