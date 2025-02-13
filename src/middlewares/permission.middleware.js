const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
module.exports = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth.role = await userService.getRole(userId);
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};