const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, resp) => {
    Product.fetchAll().then(resolve => {
        resp.render('shop/product-list', {
            prods: resolve.products,
            pageTitle: 'Shop',
            path: '/products'
        });
    });
};

exports.getProduct = (req, resp) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        resp.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
};

exports.getIndex = (req, resp) => {
    Product.fetchAll().then(resolve => {
        resp.render('shop/index', {
            prods: resolve.products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getCart = (req, resp) => {
    resp.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart'
    });
};

exports.postCart = (req, resp) => {
    const prodId = req.body.productId;
    Product.findById(prodId).then(product =>  {
        Cart.addProduct(prodId, product.price);
    });
    resp.redirect('/cart');
};

exports.getCheckout = (req, resp) => {
    resp.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

exports.getOrders = (req, resp) => {
    resp.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    });
};