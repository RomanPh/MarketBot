const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const routes = require("./routes/routes");
const config = require('./config')

//set the port to 8000 (the port we used with ngrok )
app.set('port', (config.app.port))

// Process application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(routes);

mongoose.connect(config.db.host, { user: config.db.login,
    pass: config.db.pass, useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    app.listen(app.get('port'), function() {
        console.log('server running at : ', app.get('port'))
    });
});