const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const {
    body
} = require('express-validator/check')

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);


router.post('/add-product', isAuth,
    [
        body('title', 'Please Enter a valid title')
        .isLength({
            min: 5,
            max: 255
        }),
        body('imageUrl', 'Please Enter a valid imageUrl')
        .isURL(),
        body('price', 'Please Enter a valid price')
        .isFloat(),
        body('description', 'Please Enter a valid description')
        .isLength({
            min: 5,
            max: 400
        })
    ],
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth,
    [
        body('title', 'Please Enter a valid title')
        .isLength({
            min: 5,
            max: 255
        }),
        body('imageUrl', 'Please Enter a valid imageUrl')
        .isURL(),
        body('price', 'Please Enter a valid price')
        .isFloat(),
        body('description', 'Please Enter a valid description')
        .isLength({
            min: 5,
            max: 400
        })
    ],
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

exports.routes = router;