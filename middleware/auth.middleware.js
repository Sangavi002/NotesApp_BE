const jwt = require("jsonwebtoken");
const BlackListedTokenModel = require("../model/blackListed.model");

const auth = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided. Please login." });
    }

    try {
        const isBlacklisted = await BlackListedTokenModel.exists({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Your token has been blacklisted. Please login again." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token. Please login again." });
    }
};

module.exports = auth;