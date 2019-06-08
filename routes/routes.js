'use strict';

const router = require('express').Router();
const autoload = require('./api/autoload');
require('express-group-routes');

router.group('/', (r) => {
    r.use(autoload);
});

module.exports = router;
