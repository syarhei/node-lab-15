const j2x = require('json2xml');
const j_to_x = require('jsontoxml');

module.exports = (request, response, data) => {
    if (request.get("content-type") == 'application/xml')
        response.send(j_to_x(data));
    else
        response.send(data);
};