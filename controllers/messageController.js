'use strict';

const config = require('../config');
const request = require('request');

function verify(req, res) {
    console.log('hello')
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
 console.log('mode=',mode);
 console.log('token=',token);
 console.log('challenge=',challenge);
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === config.app.PAGE_ACCESS_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

function setupGreetingText(req, res){
    console.log('setupGreetingText=', config.app.APP_ACCESS_TOKE);
    console.log('url=', `https://graph.facebook.com/v3.2/${config.app.USER_ID}/messenger_profile?access_token=`+ config.app.APP_ACCESS_TOKEN)
    var messageData = {
        "greeting":[
            {
            "locale":"default",
            "text":" Hellllooooooooooo!"
            }
        ]};
    request({
        url: `https://graph.facebook.com/v3.2/${config.app.USER_ID}/messenger_profile?access_token=`+ config.app.APP_ACCESS_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        console.log('error=', error);
         console.log('response.statusCode=', response.statusCode);
        //console.log('response=', response);
        //console.log('body=', body);
        if (!error && response.statusCode == 200) {
            // Print out the response body
            res.send(body);

        } else { 
            // TODO: Handle errors
            res.send(body);
        }
    });
}

module.exports = {
    verify,
    setupGreetingText
}