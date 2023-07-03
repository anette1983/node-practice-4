const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const [type, token] = req.headers.authorization.split(" ");
        if (type !== "Bearer") {
            res.status(404);
            throw new Error("Not a Bearer token");
        }
        console.log(token);
        if (token) {
            const validToken = jwt.verify(token, "pizza");
            console.log(validToken);
            req.user = validToken.id;
            next();
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
