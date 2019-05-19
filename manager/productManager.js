'use strict';

const productsApi = require('../helper/productsApi');

class ProductManager {
    constructor() {
        this.categories = [];
        this.products = [];
    }

    getEmptyMessage({id, name}) {
        return [{
			"title":"Nothing to show!",
            "subtitle": "Nothing to show!",
            "buttons": []
		}];
    }

    rawCategoryToCarouselItem({id, name}, buttonTitle, type) {

        console.log('type===', type)
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
    };

    rawProductToCarouselItem({sku, name, longDescription, image}, buttonTitle, type) {
        return {
            "title": name,
            "image_url": image,
            "subtitle": longDescription,
            "buttons": [
                {
                    "type":"postback",
                    "title": buttonTitle,
                    "payload": JSON.stringify({
                        type: type,
                        data: {
                            id: sku,
                        },
                    }),
                } 
            ],
        };
    };

    rawCategoriesToCarousel(data) {
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
            //this.categories = data.categories;
            return data.categories.map( category => {
                    //console.log('rawCategoriesToCarousel::category=', category)
                    this.categories.push(category);
                    console.log('rawCategoriesToCarousel::category.length=',  this.categories.length)
                    //console.log('item category=', this.rawCategoryToCarouselItem(category))
                    return this.rawCategoryToCarouselItem(category, "Get subcategory", "get_subcategories");
                });
        }
    }

    rawProductsToCarousel(recipientId, data) {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
            //this.categories = data.categories;
            return data.products.map( product => {
                    //console.log('rawCategoriesToCarousel::category=', category)
                    this.products.push(product);
                    console.log('rawCategoriesToCarousel::category.length=',  this.products.length)
                    //console.log('item category=', this.rawCategoryToCarouselItem(category))
                    return this.rawProductToCarouselItem(product, "Get product", "get_product");
                });
        } else {
            console.log('rawProductsToCarousel=>recipientId=', recipientId)
            return this.getEmptyMessage(recipientId);
        }
    }

    rawSubCategoriesToCarousel(categoryId) {
        console.log('categoryId', categoryId)
        console.log('length', this.categories.length)
        let selectedCategoryArray = this.categories.filter( category => {
                    //console.log('rawSubCategoriesToCarousel::category=', category.id);
                    //console.log('rawSubCategoriesToCarousel::category===', category.id == categoryId);
                    //console.log('item category=', this.rawCategoryToCarouselItem(category))
                    return category.id == categoryId;
                })
        if (selectedCategoryArray.length > 0 && Array.isArray(selectedCategoryArray[0].path)) {
            return selectedCategoryArray[0].path.map((pathItem) => {
                //console.log('pathItem', pathItem)
                return this.rawCategoryToCarouselItem(pathItem, "Get products", "get_products");
            });
        } else {
            console.log('-----------------')
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
        console.log('categories.lenght=', categories.length);
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
        let categories = this.rawProductsToCarousel(recipientId, rawProductsDataByCategoryId);
        console.log('categories.lenght=', categories.length);
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
}



module.exports = ProductManager;