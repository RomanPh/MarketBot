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
        let productCarosel = await this.productManager.getProductsCarosel(recipientId, data.id);
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: productCarosel
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Show products list');
    }

    async addToCart(recipientId, data) {
        let selectedProduct = await this.productManager.addToCart(recipientId, data);
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: selectedProduct
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Product is added to cart');
    }

    async getPurchaseHistory(recipientId, data) {
        let purchaseHistory = await this.productManager.getPurchaseHistory(recipientId, data);
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: purchaseHistory
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Show purchase history');
    }
}

module.exports = ProductController;