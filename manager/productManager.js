'use strict';

const productsApi = require('../helper/productsApi');
const DBManager = require('./dbManager.js');

class ProductManager {
    constructor() {
        this.categories = [];
        this.products = [];
        this.dbManager = new DBManager();
    }

    getMessage(data) {
        let {id, name, message} = data;
        return [{
			"title": message,
            "subtitle": ' ',
            "buttons": []
		}];
    }

    rawCategoryToCarouselItem({id, name}, buttonTitle, type) {
        return {
            "title": name,
            "subtitle": name,
            "buttons": [
                {
                    "type":"postback",
                    "title": buttonTitle,
                    "payload": JSON.stringify({
                        type: type,
                        data: {
                            id: id,
                        },
                    }),
                } 
            ],
        };
    }

    rawProductToCarouselItem({sku, name, longDescription, image}, buttonTitle, type) {
        let buttons = [];
        if (buttonTitle && type) {
            buttons = [
                {
                    "type":"postback",
                    "title": buttonTitle,
                    "payload": JSON.stringify({
                        type: type,
                        data: {
                            sku: sku,
                            name: name,
                            longDescription: longDescription,
                            image: image
                        },
                    }),
                } 
            ]
        }
        return {
            "title": name,
            "image_url": image,
            "subtitle": longDescription,
            "buttons": buttons,
        };
    }

    rawCategoriesToCarousel(data) {
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
            return data.categories.map( category => {
                    this.categories.push(category);
                    return this.rawCategoryToCarouselItem(category, "Get subcategory", "get_subcategories");
                });
        }
    }

    rawProductsToCarousel(recipientId, data) {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
            return data.products.map( product => {
                    this.products.push(product);
                    return this.rawProductToCarouselItem(product, "Get product", "get_product");
                });
        } else {
            return this.getMessage({recipientId, message: "Nothing to show" });
        }
    }

    rawSubCategoriesToCarousel(categoryId) {
        let selectedCategoryArray = this.categories.filter( category => {
                return category.id == categoryId;
            })
        if (selectedCategoryArray.length > 0 && Array.isArray(selectedCategoryArray[0].path)) {
            return selectedCategoryArray[0].path.map((pathItem) => {
                return this.rawCategoryToCarouselItem(pathItem, "Get products", "get_products");
            });
        } else {
            console.error('Selected category doesn\'t contain subcategories');
            return [];
        }    
    }

    async getCategoriessCarosel() {
        let rawCategoriesData = await productsApi.getCategories();
        let categories = this.rawCategoriesToCarousel(rawCategoriesData);
        console.log('categories.lenght=', categories.length);
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: categories,
                },
            },
        };
    };

    async getSubCategoriesCarosel(categoryId='unknown') {
        console.log('getSubCategoriessCarosel::categoryId=', categoryId);
        let categories = this.rawSubCategoriesToCarousel(categoryId);
        console.log('categories.lenght=', categories);
        //console.log('categories.lenght=', categories);
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: categories,
                },
            },
        };
    };

    async getProductsCarosel(recipientId, categoryId='unknown') {
        console.log('getProductsCarosel::categoryId=', categoryId);
        let rawProductsDataByCategoryId = await productsApi.getProductsList(categoryId);
        console.log('getProductsCarosel::rawProductsDataByCategoryId=', rawProductsDataByCategoryId.products.length);
        let products = this.rawProductsToCarousel(recipientId, rawProductsDataByCategoryId);
        console.log('categories.lenght=', products);
        //console.log('categories.lenght=', categories);
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: products,
                },
            },
        };
    };

    async addToCart(recipientId, data) {
        console.log('addToCart::recipientId=', recipientId);
        console.log('addToCart::data=', data);
        let savedProductMessage;
        try {
            await this.dbManager.save(recipientId, data);
            savedProductMessage = 'Product successful added to cart';
        } catch (err) {
            console.log('Saving error=', err);
            savedProductMessage = 'Product saving error to cart';
        }
        console.log('addToCart::savedProductMessage=', savedProductMessage);
        let resultAdding = this.getMessage({id: recipientId, message: savedProductMessage });
        console.log('resultAdding=', resultAdding)
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: resultAdding,
                },
            },
        };
    }

    async getPurchaseHistory(recipientId, data) {
        let purchaseHistory;
        let purchaseHistoryCarusel = [];
        try {
            purchaseHistory = await this.dbManager.find(recipientId);
        } catch(err) {
            console.error('getPurchaseHistory::error=', err);
            purchaseHistory = []
        }
        
        purchaseHistory = purchaseHistory.length && purchaseHistory[0]; 
        console.log('getPurchaseHistory::purchaseHistory=', purchaseHistory.products.l);
        purchaseHistory.products.forEach( item => {
            console.log('purchaseHistory::item=', item);
                console.log('getPurchaseHistory::itemProduct.product=', item.product)
                purchaseHistoryCarusel.push(this.rawProductToCarouselItem(item.product));            
        });
         
        if (!purchaseHistoryCarusel.length) purchaseHistoryCarusel = this.getMessage({id: recipientId, message: "History is empty" });
        console.log('getPurchaseHistory::purchaseHistoryCarusel=', purchaseHistoryCarusel);
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: purchaseHistoryCarusel,
                },
            },
        };
    }
}



module.exports = ProductManager;