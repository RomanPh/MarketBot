"use strict";

const config = require('../config');
const request = require('request');

function sendAPIGraphRequest(messageData, logLabel='unknown') {
    request({
        url: `https://graph.facebook.com/v3.2/${config.app.USER_ID}/messenger_profile?access_token=` + config.app.APP_ACCESS_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(`${logLabel}. Response status: `, body);

        } else { 
            console.error(`${logLabel}. Error status: `, body);
        }
    });
}

function sendApiGraphMessage(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.app.APP_ACCESS_TOKEN },
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let recipientId = body.recipient_id;
            let messageId = body.message_id;
        } else {
            console.error("Unable to send message=", error);
        }
    });  
}

module.exports = {
    sendAPIGraphRequest,
    sendApiGraphMessage
}