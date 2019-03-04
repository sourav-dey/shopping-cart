const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAddProduct = (req, resp) => {
    if (!req.session.isLoggedIn) {
        return resizeBy.redirect('/login');
    }
    resp.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getEditProduct = (req, resp) => {
    const editMode = req.query.edit;
    if (editMode && editMode !== 'true') {
        return resp.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return resp.redirect('/');
            }
            resp.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode === undefined || editMode === 'true',
                product: product,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.error(err));
};

exports.postAddProduct = (req, resp) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    });
    product.save()
        .then(result => {
            resp.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, resp) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    let product = {
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl
    };

    Product.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(id)
            },
            product, {
                upsert: true
            }
        )
        .then(result => {
            resp.redirect('/admin/products')
        })
        .catch(err => console.error(err));
};

exports.getProducts = (req, resp) => {
    Product.find()
        .then((products) => {
            resp.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.error(err));
};

exports.postDeleteProduct = (req, resp) => {
    const productId = req.body.productId;
    Product.findByIdAndDelete(productId)
        .then(() => resp.redirect('/admin/products'))
        .catch(err => console.error(err));
};