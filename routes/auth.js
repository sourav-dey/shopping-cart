const express = require('express');
const {
    check,
    body
} = require('express-validator/check')
const User = require('../models/user')

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post(
    '/signup',
    [
        check('email')
        .isEmail()
        .withMessage("Please Enter a valid email")
        .normalizeEmail()
        .custom((value, {
            req
        }) => {
            return User.findOne({
                    email: value
                })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already exists.');
                    }
                });
        }),
        body('password', 'Please enter a password with only numbers and text and atleast 8 characters')
        .isLength({
            min: 8
        })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match!');

            }
        })
    ], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
exports.routes = router