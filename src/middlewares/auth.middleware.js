import jwt from 'jsonwebtoken';

const verifyTokenAndRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: false, message: 'Token is required or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
        console.log("XXXXXXXXXXXXXXXXX:",token)

        jwt.verify(token, "shhhh", (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ status: false, message: 'Token has expired' });
                }
                return res.status(401).json({ status: false, message: 'Invalid token' });
            }

            console.log('Decoded Token:', decoded); // Debug decoded token

            req.data = decoded;

            if (!allowedRoles.includes(decoded.role)) {
                console.log('Role Mismatch: User role is not allowed'); // Debug role mismatch
                return res.status(403).json({ status: false, message: 'Access denied: Insufficient permissions' });
            }

            next(); // Proceed if everything is fine
        });
    };
};

export default verifyTokenAndRole;
