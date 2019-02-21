const Product = require('../models/product');

exports.getAddProduct = (req, resp) => {
    resp.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getEditProduct = (req, resp) => {
    const editMode = req.query.edit;
    if (editMode && editMode !== 'true') {
        return resp.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId).then(product => {
        if (!product) {
            return resp.redirect('/');
        }
        resp.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode === undefined || editMode === 'true',
            product: product
        });
    });
};

exports.postAddProduct = (req, resp) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    resp.redirect('/');
};

exports.postEditProduct = (req, resp) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(id, title, imageUrl, description, price);
    product.save();
    resp.redirect('/admin/products');
};

exports.getProducts = (req, resp) => {
    Product.fetchAll().then(resolve => {
        resp.render('admin/products', {
            prods: resolve.products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};

exports.postDeleteProduct = (req, resp) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    resp.redirect('/admin/products');
};