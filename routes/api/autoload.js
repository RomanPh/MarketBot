'use strict';

const router = require('express').Router();
const fileSystem = require('fs');
const path = require('path');

fileSystem.readdirSync(__dirname).forEach((file) => {
    if (file !== path.basename(__filename)) {
        router.use(require('./' + file));
    }
});

module.exports = router;

