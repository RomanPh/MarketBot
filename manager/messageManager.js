'use strict';

const requestHelper = require('./../helper/sender');
/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */
const handleReceivePostback = (event) => {
	/**
	 * The 'payload' param is a developer-defined field which is
	 * set in a postbackbutton for Structured Messages.
	 *
	 * In this case we've defined our payload in our postback
	 * actions to be a string that represents a JSON object
	 * containing `type` and `data` properties. EG:
	 */
	const type = event.postback.payload;
	const senderId = event.sender.id;
	let messageData = {
					recipient: {
						id: senderId
					},
					message: {
						text: ''
					}
				};
	// Perform an action based on the type of payload received.
	if (type.substring(0, 11) === 'main_menu') {
			messageData.message.text = 'You come back on main page';
			requestHelper.sendApiGraphMessage(messageData);
	} else if (type.substring(0, 16) === 'product_list') {
			sendSharedLists(senderId, type);
	} else if (type.substring(0, 11) === 'get_started') {
			requestHelper.sendApiGraphMessage(messageData);
			return;
	} else {
			console.error(`Unknown Postback called: ${type}`);
	}
};

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
	const message = event.message;
	const senderId = event.sender.id;
	const messageData = {
					recipient: {
						id: senderId
					},
					message: {
						text: ''
					}
				};
	console.log('Input event=', event);
	requestHelper.sendAPIGraphRequest(messageData);	

	if (message.text) { requestHelper.sendApiGraphMessage(messageData); }
};

module.exports = {
	handleReceivePostback,
	handleReceiveMessage,
};
