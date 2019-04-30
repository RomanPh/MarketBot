'use strict';
const router = require('express').Router();
require('express-group-routes');
const messageController = require('./../../controllers/messageController');


router.group('/', (router) => {
    router.get('/webhook', messageController.verify);
    router.post('/webhook', messageController.webhookHandler);
    router.get('/setup', messageController.setup);
    
});

module.exports = router;