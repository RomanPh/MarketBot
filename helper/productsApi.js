'use strict';

const config = require('../config');
const request = require('request-promise');

function getCategories() {
    let options = {
        method: 'GET',
        uri: `https://api.bestbuy.com/v1/categories?apiKey=${config.app.BestBuy_Api_Key}&format=json`,
        json: true 
    };
   
   return request(options);
}


function getProductsList(category='unknown') {
    let options = {
        method: 'GET',
        uri: `https://api.bestbuy.com/v1/products((categoryPath.id=${category}))?apiKey=${config.app.BestBuy_Api_Key}&format=json`,
        json: true 
    };
   
   return request(options);
}

module.exports = {
    getCategories,
    getProductsList
}