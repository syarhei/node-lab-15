"use strict";

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const response_send = require('../utils/response');
const axs = require('axios');

module.exports = (userServices, domainServices) => {

    let user = express.Router();

    user.post('/', (request, response) => {
        let params = request.body;
        userServices.checkUser(params).then((result) => {
            if (result == undefined) {
                let object = {
                    name: params.name,
                    password: params.password,
                    contact: params.contact,
                    balance: 1000000
                };
                userServices.createUser(object);
                //response.redirect('../index.html');
                response_send(request, response, { message: 'Registration is successful'});
            }
            else {
                response_send(request, response, { Error: 'This user-name is already exists' });
            }
        });
    });

    user.get('/domains', (request, response) => {
        let token = request.cookies.token;
        let params = request.query;

        jwt.verify(token, config.jwt.secretKey, (error, payload) => {
            if (payload == undefined)
                response_send(request, response, { Error: 'Token is not found' });
            else {
                userServices.checkUser({name: payload.user}).then((result) => {
                    if (result == undefined) response_send(request, response, { Error: 'Данный пользователь уже не доступен' });
                    else {
                        if (params.offset == undefined || params.limit == undefined) {
                            domainServices.getDomains(payload.user).then((data) => {
                                response_send(request, response, {domains: data})
                            })
                        }
                        else {
                            domainServices.getDomainsLimit(payload.user, params).then((data) => {
                                response_send(request, response, {domains: data})
                            })
                        }
                    }
                }).catch((error) => {
                    response_send(request, response, error)
                })
            }

        })
    });

    user.post('/domains', (request, response) => {
        let domain = request.body;
        let token = request.cookies.token;
        axs.get('https://api.domainr.com/v2/status?domain=' + domain.name + '&client_id=fb7aca826b084569a50cfb3157e924ae', {
            headers: {
                'Origin': 'https://www.namecheap.com'
            }
        }).then((result) => {
            if (result.data.status[0] == undefined)
                response_send(request, response, { Error: 'Не правильно введено имя домена'});
            else if (result.data.status[0].summary == 'active')
                response_send(request, response, { Error: 'Домен занят' });
            else {
                jwt.verify(token, config.jwt.secretKey, (error, payload) => {
                    if (payload == undefined) response_send(request, response, { Error: 'Token is not found' });
                    else {
                        userServices.checkUser({name: payload.user}).then((resultUser) => {
                            if (resultUser == undefined) response_send(request, response, { Error: 'Данный пользователь уже не доступен' });
                            else {
                                domainServices.checkDomain(domain).then((data) => {
                                    if (data == undefined) {
                                        let cost = resultUser.balance - domain.cost;
                                        Promise.all([userServices.updateUser(payload.user, cost),
                                            domainServices.addDomain(payload.user, domain)]).then
                                        (response_send(request, response, { Success: 'Отлично, домен зарегестрирован в БД' }));
                                    }
                                    else response_send(request, response, {Error: 'Домен уже зарегистрирован в БД'});
                                });
                            }
                        }).catch((error) => {
                            response_send(request, response, error)
                        })
                    }

                })
            }
        })
    });

    user.delete('/domains', (request, response) => {
        let domain = request.body;
        let token = request.cookies.token;

        jwt.verify(token, config.jwt.secretKey, (error, payload) => {
            if (payload == undefined) response_send(request, response, {Error: 'Token is not found'});
            else {
                userServices.checkUser({name: payload.user}).then((resultUser) => {
                    if (resultUser == undefined) response_send(request, response, {Error: 'Данный пользователь уже не доступен'});
                    else {
                        domainServices.deleteDomain(payload.user, domain.name).then((result) => {
                            if (result == 1) response_send(request, response, {Error: 'Удаление домена прошло успешно'});
                            if (result == 0) response_send(request, response, {Error: 'Под данным пользователем нет такого домена'});
                        })
                    }
                }).catch((error) => {
                    response_send(request, response, error);
                })
            }

        })
    });

    return user;

};