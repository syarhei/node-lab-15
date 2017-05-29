const express = require('express');

module.exports = (userServices, domainServices, config) => {
    const router = express.Router();

    const userController = require('./user')(userServices, domainServices);
    const sessionController = require('./session') (userServices);

    router.use('/users', userController);
    router.use('/sessions', sessionController);

    return router;
};