'use strict';

const requestHelper = require('./../helper/sender');
const ProductController = require('../controllers/productController');

class MessageManager {
	constructor() {
		this.productController = new ProductController();
	}

	handleReceivePostback (event) {
		//console.log('handleReceivePostback= ', event);
		const {type, data} = JSON.parse(event.postback.payload);
		console.log('payload= ', event.postback.payload);
		console.log('data= ', data);
		console.log('type= ', type);
		console.log('type.substring(0, 16)= ', type.substring(0, 16));
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
		} else if (type.substring(0, 16) === 'get_categories') {
			console.log('get_categories ');
			this.productController.getCategoriesCarosel(senderId);
		} else if (type.substring(0, 17) === 'get_subcategories') {
			console.log('get_subcategory ');
			this.productController.getSubCategoriesCarosel(senderId, data);
		} else if (type.substring(0, 16) === 'get_products') {
			console.log('get_products ');
			this.productController.getProductsCaroselByCategory(senderId, data);
		} else if (type.substring(0, 11) === 'get_started') {
			console.log('get_started ');
			requestHelper.sendApiGraphMessage(messageData);
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
	handleReceiveMessage (event) {
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
}

module.exports = MessageManager;