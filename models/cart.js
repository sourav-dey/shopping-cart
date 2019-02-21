const fs = require('fs');
const path = require('path');
const fileDir = require('../util/path');

const p = path.join(fileDir,
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        //fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                try {
                    cart = JSON.parse(fileContent);
                } catch (e) {
                    console.log("Nothing in cart");
                }
            }
            //Analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                //cart.products =[...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products.push(updatedProduct);
                //cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.error(err);
            });
        });
    }

    static deleteProductById(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const productIndex = cart.products.findIndex(p => p.id === id);
            const prod = cart.products[productIndex];
            cart.products = cart.products.filter(p => p.id !== id);
            cart.totalPrice -= +price * +prod.qty;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.error(err);
            });
        });
    }
};