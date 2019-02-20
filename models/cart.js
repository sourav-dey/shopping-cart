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
                cart = JSON.parse(fileContent);
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
};