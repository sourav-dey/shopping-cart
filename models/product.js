const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = mongoDb.ObjectId(id);
    }

    save() {
        let dbOp;
        if (this._id) {
            dbOp = getDb().collection('products').updateOne({
                _id: this._id
            }, {
                $set: {
                    title: this.title,
                    price: this.price,
                    description: this.description,
                    imageUrl: this.imageUrl
                }
            });
        } else {
            dbOp = getDb().collection('products').insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.error(err);
            });
    }

    static fetchAll() {
        return getDb()
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => console.error(err));
    }

    static findById(prodId) {
        return getDb()
            .collection('products')
            .find({
                _id: mongoDb.ObjectId(prodId)
            })
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.error(err));
    }
}

module.exports = Product;