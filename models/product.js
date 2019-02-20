const fs = require('fs');
const path = require('path');
const guid = require('uuid/v4');
const fileDir = require('../util/path');

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
            resolve({
                path: p,
                products: JSON.parse(data)
            });
        });
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = guid();
        getProductsFromFile().then(resolve => {
            resolve.products.push(this);
            fs.writeFile(resolve.path, JSON.stringify(resolve.products), err1 => {
                console.log(err1);
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