const Product = require('../models/product');

exports.getAddProduct = (req, resp) => {
    resp.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.getEditProduct = (req, resp) => {
    const editMode = req.query.edit;
    if (editMode !== 'true') {
        resp.redirect('/');
    }
    resp.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode
    });
};

exports.postAddProduct = (req, resp) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    resp.redirect('/');
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