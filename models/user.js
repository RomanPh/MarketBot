const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        uuid: String,
        products: [
            {
                quantity: Number,
                product:{
                    sku: Number,
                    name: String,
                    image: String,
                    longDescription: String
                }
            }
        ]
    }, 
    {
        versionKey: false
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;