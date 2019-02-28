const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);



// const mongoDb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id;
//         this.userId = userId;
//     }

//     save() {
//         let dbOp;
//         if (this._id) {
//             dbOp = getDb().collection('products').updateOne({
//                 _id: new mongoDb.ObjectId(this._id)
//             }, {
//                 $set: {
//                     title: this.title,
//                     price: this.price,
//                     description: this.description,
//                     imageUrl: this.imageUrl
//                 }
//             });
//         } else {
//             dbOp = getDb().collection('products').insertOne(this);
//         }
//         return dbOp
//             .then(result => {
//                 console.log("Created:", result);
//             })
//             .catch(err => {
//                 console.error(err);
//             });
//     }

//     static fetchAll() {
//         return getDb()
//             .collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 console.log(products);
//                 return products;
//             })
//             .catch(err => console.error(err));
//     }

//     static findById(prodId) {
//         return getDb()
//             .collection('products')
//             .find({
//                 _id: mongoDb.ObjectId(prodId)
//             })
//             .next()
//             .then(product => {
//                 console.log(product);
//                 return product;
//             })
//             .catch(err => console.error(err));
//     }

//     static deleteById(prodId) {
//         return getDb().collection('products').deleteOne({
//                 _id: new mongoDb.ObjectId(prodId)
//             })
//             .then(result => console.log('Deleted'))
//             .catch(err => console.error(err));
//     }
// }

// module.exports = Product;