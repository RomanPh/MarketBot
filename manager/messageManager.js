'use strict';

const requestHelper = require('./../helper/sender');
const ProductController = require('../controllers/productController');

class MessageManager {
	constructor() {
		this.productController = new ProductController();
	}

	handleReceivePostback(event) {
		const {type, data} = JSON.parse(event.postback.payload);
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
			this.productController.getCategoriesCarosel(senderId);
		} else if (type.substring(0, 17) === 'get_subcategories') {
			this.productController.getSubCategoriesCarosel(senderId, data);
		} else if (type.substring(0, 16) === 'get_products') {
			this.productController.getProductsCaroselByCategory(senderId, data);
		} else if (type.substring(0, 11) === 'get_started') {
			requestHelper.sendApiGraphMessage(messageData);
		} else if (type.substring(0, 11) === 'get_product') {
			this.productController.addToCart(senderId, data);
		} else if (type.substring(0, 11) === 'get_history') {
			this.productController.getPurchaseHistory(senderId, data);
		} else {
			console.error(`Unknown Postback called: ${type}`);
		}
	}

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
	}
}

module.exports = MessageManager;