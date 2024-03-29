const jwt = require("jsonwebtoken")
const secretKey = process.env.SECRET

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, `${secretKey}`);
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID"
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({error: error | "Unauthorized request"})
    }
}