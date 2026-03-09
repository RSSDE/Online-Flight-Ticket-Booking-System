const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(401)
            .json({ status: 'error', message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, config.SECRET);
        req.user_id = payload.user_id;
        next();
    } catch {
        return res
            .status(401)
            .json({ status: 'error', message: 'Invalid token' });       
    }
}