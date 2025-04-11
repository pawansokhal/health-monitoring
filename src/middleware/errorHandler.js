function errorHandler(err, req, res, next) {
    const status = err.status || 500;  // Default to 500 if no status is set on the error
    res.status(status).json({ error: err.message });
}

module.exports = errorHandler;
