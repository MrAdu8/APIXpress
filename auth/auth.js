const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!jwtToken) {
        res.apiResponse = {
            status: 'failed',
            statusCode: 500,
            message: 'Authentication Needed.',
            error: 'Access denied!! Token Needed',
        };
        return next();
    }

    try {
        const auth = jwt.verify(jwtToken, SECRET_KEY);
        req.user = auth;
        next();
    } catch (error) {
        res.apiResponse = {
            status: 'failed',
            statusCode: 200,
            message: 'Authentication failed.',
            error: 'Access denied!! Token Failed',
            data: error.message,
        };
        next();
    }
};
