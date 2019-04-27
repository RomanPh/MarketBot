'use strict';
const router = require('express').Router();
require('express-group-routes');
const messageController = require('./../../controllers/messageController');


router.group('/', (router) => {
    router.get('/webhook', messageController.verify);
    router.get('/setup', messageController.setupGreetingText);
});

module.exports = router;