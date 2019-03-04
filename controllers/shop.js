const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, resp) => {
    Product.find()
        .then(products => {
            resp.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
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
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
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
    // if (!req.session.user) {
    //     return resp.redirect('/login');
    // }
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            resp.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
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
      .then(result => {
        console.log(result);
        resp.redirect('/cart');
      });
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
    if (!req.user) {
        return resp.redirect('/login');
    }
    Order.find({
            'user.userId': req.user._id
        })
        .then(orders => {
            resp.render('shop/orders', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/orders',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.error(err));
};

exports.postOrder = (req, resp) => {
    if (!req.user) {
        return resp.redirect('/login');
    }

    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: {
                        ...i.productId._doc
                    }
                };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => resp.redirect('/orders'))
        .catch(err => console.error(err));
}