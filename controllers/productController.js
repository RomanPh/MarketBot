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
        console.log('getSubCategoriesCarosel=', data);
        let productCarosel = await this.productManager.getSubCategoriesCarosel(data.id);
         console.log('productCarosel0000000=', productCarosel);
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: productCarosel
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Show products list');
    }

    async getProductsCaroselByCategory(recipientId, data) {
        console.log('getProductsCaroselByCategory=', data);
        let productCarosel = await this.productManager.getProductsCarosel(recipientId, data.id);
        console.log('productCarosel222222222222=', productCarosel);
        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            message: productCarosel
                        };
        requestHelper.sendApiGraphMessage(messageData, 'Show products list');
    }

    async addToCart(recipientId, data) {
        console.log('product controller addToCart=', data);
        let selectedProduct = await this.productManager.addToCart(recipientId, data);
        console.log('selectedProduct=', selectedProduct)
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
         console.log('purchaseHistory=', purchaseHistory)
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