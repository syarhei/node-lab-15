module.exports = () => {
    return (request, response, next) => {
        request.page_format = request.get("content-type") || 'application/json';
        next();
    }
};