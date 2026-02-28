import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_TOKEN || process.env.JWT_SECRET || 'secret');

            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email
            };

            return next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token has expired" });
            }
            return res.status(401).json({ message: "Not authorized. token failed" });
        }
    }
    return res.status(401).json({ message: "Not authorized, no token" });
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ message: "You do not have permission to perform this action" });
        }
        next();
    };
};

export { protect, authorize };