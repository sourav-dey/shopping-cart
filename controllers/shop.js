const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, resp) => {
    Product.findAll()
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
    Product.findByPk(prodId)
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
    Product.findAll()
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
    Cart.getCart().then(cart => {
        Product.fetchAll()
            .then(([rows, fieldData]) => {
                const cartProducts = [];
                rows.forEach((prod) => {
                    const cartProd = cart.products.find(p => p.id === prod.id);
                    if (cartProd) {
                        cartProducts.push({
                            ProductData: prod,
                            qty: cartProd.qty
                        });
                    }
                });
                resp.render('shop/cart', {
                    pageTitle: 'Cart',
                    path: '/cart',
                    products: cartProducts
                });
            })
            .catch(err => console.error(err));
    });
};

exports.postCart = (req, resp) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(([rows, fieldData]) => {
            Cart.addProduct(prodId, rows[0].price);
            resp.redirect('/cart');
        })
        .catch(err => console.error(err));
};

exports.postCartDeleteProduct = (req, resp) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(([rows, fieldData]) => {
            Cart.deleteProductById(prodId, rows[0].price);
            resp.redirect('/cart');
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
    resp.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    });
};