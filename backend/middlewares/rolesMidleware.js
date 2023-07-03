const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
    return (req, res, next) => {
        try {
            const [type, token] = req.headers.authorization.split(" ");
            if (type !== "Bearer") {
                res.status(404);
                throw new Error("Not a Bearer token");
            }
            if (token) {
                const validToken = jwt.verify(token, "pizza");

                const roles = validToken.roles;

                let hasRole = false;

                roles.forEach((role) => {
                    if (rolesArr.includes(role)) {
                        hasRole = true;
                    }
                });

                if (!hasRole) {
                    res.status(403);
                    throw new Error("Forbidden");
                }

                next();
            }
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    };
};
