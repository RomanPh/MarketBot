'use strict';

const config = require('../config');
const request = require('request');
const requestHelper = require('./../helper/sender');
const messageManager = require('./../manager/messageManager');

function verify(req, res) {
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

function setup(req, res) {
    setupGreetingText();
    setupGetStartedButton()
    setupPersistentMenu();
    res.sendStatus(200);
}

function setupGreetingText(){
    console.log('setupGreetingText=', config.app.APP_ACCESS_TOKE);
    console.log('url=', `https://graph.facebook.com/v3.2/config.app./messenger_profile?access_token=`+ config.app.APP_ACCESS_TOKEN)
    let messageData = {
        "greeting":[
            {
            "locale":"default",
            "text":" Hello!"
            }
        ]};
    requestHelper.sendAPIGraphRequest(messageData, 'Setup greeting text');
}

function setupPersistentMenu(){
    let messageData = 
        {"persistent_menu":[
            {
            "locale":"default",
            "composer_input_disabled":false,
            "call_to_actions":[
                {
                    "title":"Main menu",
                    "type":"postback",
                    "payload":"main_menu"
                },
                {
                    "title":"Product list",
                    "type":"postback",
                    "payload":"product_list"
                }
            ]}
        ]};  
    requestHelper.sendAPIGraphRequest(messageData, 'Setup persistent menu');
}

function setupGetStartedButton(){
    let messageData = {
            "get_started":{
                "payload":"getstarted"
            }
    };
    requestHelper.sendAPIGraphRequest(messageData, 'Setup started button');
}

function webhookHandler(req, res) {
    const data = req.body;
    res.sendStatus(200);
    
    console.log('Webhook POST', JSON.stringify(data));

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      if (!pageEntry.messaging) {
        return;
      }
      // Iterate over each messaging event and handle accordingly
      pageEntry.messaging.forEach((messagingEvent) => {
        console.log('Item event message= ', {messagingEvent});

        if (messagingEvent.message) {
            console.log('handleReceiveMessage');
            messageManager.handleReceiveMessage(messagingEvent);
        }

        if (messagingEvent.postback) {
            console.log('handleReceivePostback');
            messageManager.handleReceivePostback(messagingEvent);
        } else {
          console.log(
            'Webhook received unknown messagingEvent: ',
            messagingEvent
          );
        }
      });
    });
  }
};

module.exports = {
    verify,
    setup,
    webhookHandler
}