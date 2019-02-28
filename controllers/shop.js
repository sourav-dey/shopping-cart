const Product = require('../models/product');

exports.getProducts = (req, resp) => {
    Product.find()
        .then(products => {
            resp.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, resp) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            resp.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.error(err));
};

exports.getIndex = (req, resp) => {
    Product.find()
        .then(products => {
            resp.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, resp) => {
    req.user.getCart()
        .then(products => {
            resp.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, resp) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            resp.redirect('/cart');
        })
        .catch(err => console.error(err));
};

exports.postCartDeleteProduct = (req, resp) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(() => {
            resp.redirect('/cart')
        })
        .catch(err => console.error(err));
};

exports.getCheckout = (req, resp) => {
    resp.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

exports.getOrders = (req, resp) => {
    req.user.getOrders()
        .then(orders => {
            resp.render('shop/orders', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/orders'
            });
        })
        .catch(err => console.error(err));
};

exports.postOrder = (req, resp) => {
    let fetchedCart;
    req.user.addOrder()
        .then(() => {
            resp.redirect('/orders');
        })
        .catch(err => console.error(err));
}