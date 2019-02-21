const fs = require('fs');
const path = require('path');
const shortId = require('shortid');
const fileDir = require('../util/path');
const Cart = require('./cart');

const getProductsFromFile = () => {
    const p = path.join(fileDir,
        'data',
        'products.json');

    return new Promise(resolve => {
        fs.readFile(p, (err, data) => {
            if (err) {
                resolve({
                    path: p,
                    products: []
                });
            }
            try {
                resolve({
                    path: p,
                    products: JSON.parse(data)
                });
            } catch (e) {
                resolve({
                    path: p,
                    products: []
                });
            }
        });
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile().then(resolve => {
            if (this.id) {
                const existingProductIndex = resolve.products.findIndex(p => p.id === this.id);
                const existingProduct = resolve.products[existingProductIndex];
                if (JSON.stringify(existingProduct) === JSON.stringify(this)) {
                    return;
                }
                resolve.products[existingProductIndex] = this;
            } else {
                this.id = shortId.generate();
                resolve.products.push(this);
            }
            fs.writeFile(resolve.path, JSON.stringify(resolve.products), err1 => {
                console.log(err1);
            });
        });
    }

    static deleteById(id) {
        getProductsFromFile().then(resolve => {
            const prod = resolve.products.find(p => p.id === id);
            const updatedProducts = resolve.products.filter(p => p.id !== id);
            const parsedJson = JSON.stringify(updatedProducts);
            fs.writeFile(resolve.path, parsedJson, err => {
                console.log("Whatever");
                if (!err) {
                    Cart.deleteProductById(id, prod.price);
                }
            });
        });
    }

    static fetchAll() {
        return getProductsFromFile();
    }

    static findById(id) {
        return new Promise(resolve => {
            getProductsFromFile().then(productsObject => {
                resolve(productsObject.products.find(p => p.id === id));
            });
        });
    }
};