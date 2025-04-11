const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        const error = new Error('Token is missing');
        error.status = 401;
        return next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const error = new Error('Invalid token');
            error.status = 403;
            return next(error);
        }

        req.user = user;
        next();
    });
}


function authorizeAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        const error = new Error('You do not have permission to access this resource');
        error.status = 403;
        return next(error);
    }
    next();
}

module.exports = { authenticateToken, authorizeAdmin };
