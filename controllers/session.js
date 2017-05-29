const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const response_send = require('../utils/response');

module.exports = (userServices) => {

    const session = express.Router();

    session.post('/', (request, response) => {
        let params = request.body.params;

        userServices.checkPass(params).then((result) => {
            if (result == undefined) {
                response_send(request, response, { error: 'This user is not in DB'});
                //response.end('This user is not in DB')
            }
            else {
                let token = jwt.sign({
                    user: params.user
                }, config.jwt.secretKey, {expiresIn: config.jwt.expires});
                response.cookie('token', token);
                response_send(request, response, { message: 'Hello, ' + params.user});
                //response.redirect('/api/sessions?token=' + token);
            }
        })
    });

    session.get('/', (request, response) => {
        let params = request.query;

        if (params.token) {

            jwt.verify(params.token, config.jwt.secretKey, (error, payload) => {
                if (!payload) {
                    response_send(request, response, { error: 'Your token is not found'});
                    //response.writeHead(200, {'Content-Type': 'text/html'});
                    //response.end('Your token is not found </br>' +
                        //'<a href="../index.html">to Start Page</a>');
                }
                else {
                    response_send(request, response, { message: 'Hello, ' + payload.user});
                    //response.cookie('token', params.token);
                    //response.redirect('../panel.html');
                }
            })
        }
        else response_send(request, response, { error: 'You don`t have a token in your params'});
            //response.end('You don`t have a token in your params');
    });

    return session;

};