const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        required: String
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

UserSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;
    return this.save();
}

UserSchema.methods.deleteItemFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(i => {
        return i.productId.toString() !== productId.toString()
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

UserSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    };
    return this.save();
}

module.exports = mongoose.model('User', UserSchema);

// const mongoDb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart === undefined ? -1 : this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });

//         let newQuantity = 1;
//         let updatedCartItems = this.cart === undefined ? [] : [...this.cart.items];
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new mongoDb.ObjectId(product._id),
//                 quantity: newQuantity
//             });
//         }

//         const updatedCart = {
//             items: updatedCartItems
//         };

//         const db = getDb();
//         return db.collection('users').updateOne({
//             _id: mongoDb.ObjectId(this._id)
//         }, {
//             $set: {
//                 cart: updatedCart
//             }
//         });
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users').find({
//                 _id: mongoDb.ObjectId(userId)
//             })
//             .next()
//             .then(user => {
//                 console.log(user);
//                 return user;
//             })
//             .catch(err => console.error(err));
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart === undefined ? [] : this.cart.items.map(p => {
//             return p.productId;
//         });
//         return db.collection('products').find({
//                 _id: {
//                     $in: productIds
//                 }
//             }).toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(f => {
//                             return f.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             })
//             .catch(err => console.log(err));
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(p => {
//             return p.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         return db.collection('users').updateOne({
//             _id: new mongoDb.ObjectId(this._id)
//         }, {
//             $set: {
//                 cart: {
//                     items: updatedCartItems
//                 }
//             }
//         });
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongoDb.ObjectId(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             };
//             return db.collection('orders').insertOne(order);
//         }).then(result => {
//             this.cart = {
//                 items: []
//             };
//             return db.collection('users').updateOne({
//                 _id: new mongoDb.ObjectId(this._id)
//             }, {
//                 $unset: {
//                     cart: {
//                         items: []
//                     }
//                 }
//             });
//         });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({
//             'user._id': new mongoDb.ObjectId(this._id)
//         }).toArray();
//     }
// }

// module.exports = User;