'use strict';

const ProductManager = require('../manager/productManager');
const requestHelper = require('./../helper/sender');

class ProductController {
    constructor() {
        this.productManager = new ProductManager();
    }
    async getCategoriesCarosel(recipientId) {
        let productCarosel = await this.productManager.getCategoriessCarosel();
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: productCarosel
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Show products list');
    }

    async getSubCategoriesCarosel(recipientId, data) {
        console.log('data=', data);
        let productCarosel = await this.productManager.getSubCategoriesCarosel(data.id);
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: productCarosel
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Show products list');
    }

    async getProductsCaroselByCategory(recipientId, data) {
        console.log('data=', data);
        let productCarosel = await this.productManager.getProductsCarosel(data.id);
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: productCarosel
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Show products list');
    }
}


module.exports = ProductController;