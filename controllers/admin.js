const mongoose = require('mongoose');

const Product = require('../models/product');
const {
    validationResult
} = require('express-validator/check')

exports.getAddProduct = (req, resp) => {
    if (!req.session.isLoggedIn) {
        return resizeBy.redirect('/login');
    }
    resp.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null,
        hasErrors: false,
        validationErrors: []
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
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: null,
                hasErrors: false,
                validationErrors: []
            });
        })
        .catch(err => console.error(err));
};

exports.postAddProduct = (req, resp) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            pageTitle: 'Add Product',
            editing: false,
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: errors.array()[0].msg,
            hasErrors: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            validationErrors: errors.array()
        });
    }

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(422).render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit Product',
            editing: true,
            isAuthenticated: req.session.isLoggedIn,
            errorMessage: errors.array()[0].msg,
            hasErrors: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description,
                _id: id
            },
            validationErrors: errors.array()
        });
    }

    let product = {
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl
    };

    Product.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(id),
                userId: req.user._id
            },
            product, {
                upsert: true
            }
        )
        .then(result => {
            if (result.userId !== req.user._id) {
                return resp.redirect('/');
            }
            resp.redirect('/admin/products')
        })
        .catch(err => console.error(err));
};

exports.getProducts = (req, resp) => {
    Product.find({
            userId: req.user._id
        })
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
    Product.deleteOne({
            _id: productId,
            userId: req.user._id
        })
        .then(() => resp.redirect('/admin/products'))
        .catch(err => console.error(err));
};