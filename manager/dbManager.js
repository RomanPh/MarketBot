const Mongoose = require("mongoose");
const User = require('./../models/user');
const _ = require('lodash');

class DBManager {
	constructor() {}

	async save(recipientId, data) {
		console.log('DBManager::save::recipientId=', recipientId);
		console.log('DBManager::save::data=', data);
		let isProductAdded = true;
		let userProducts = await this.find(recipientId);
		console.log('DBManager::save::product=', userProducts);
		if (userProducts && userProducts.err) return userProducts;
		console.log('DBManager::save::product=', userProducts);
		if (userProducts.length) {
			for(let item of userProducts) {
				let newProductsList = item.products.map( itemProduct => {
					console.log('itemProduct====', itemProduct)
					/*console.log('item====', itemProduct.product)
					console.log('data====', data)*/
					if (JSON.stringify(itemProduct.product) === JSON.stringify(data)) {
						console.log('itemProduct1111111111111111111111==========', itemProduct)
						itemProduct.quantity += 1;
						isProductAdded = false;
						console.log('itemProduct2222==========', itemProduct)
						return itemProduct;
					} else {
						console.log('itemProduct+++++++++++++++++++++++==========', itemProduct)
						return itemProduct;
					}
				});
				console.log('isProductAdded212312312=', isProductAdded)
				console.log('before      newProductsList length=', newProductsList.length);
				if (isProductAdded) newProductsList.push({
						quantity: 1,
						product: data
					});
				console.log('after                 newProductsList length=', newProductsList.length);
				console.log('newProductsList=', newProductsList);
				return User.updateOne({ uuid: recipientId }, { $set:{ "products": newProductsList} } , { upsert: true }, function(err, result){
					console.log('DBManager::updateOne::err=', err);
					if(err) return "Product can not be updated";
					console.log('DBManager::updateOne::result=', result);
					return result;
				});
			};
		} else {
			let user = new User({
				uuid: recipientId,
				products: [
					{
						quantity: 1,
						product: data
					}
				]
			});
			return user.save(err => {
				console.log('DBManager::user.save::err===', err);
				if (err) return "Can not be added";
				return "Product added to cart";
			});
		}
		
	}

	async find(recipientId) {
		console.log('DBManager:: find::recipientId=', recipientId);
		return User.find({ uuid: recipientId }, function(err, docs) {
			console.log('DBManager::find::err=', err);
			if (err) return { err: "Can not be added" };
			console.log('DBManager::find::docs=', docs);
			return docs;
		})

	}
};

module.exports = DBManager;