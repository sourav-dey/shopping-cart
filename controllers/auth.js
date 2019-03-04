const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const env = require('dotenv');
const sendGridTransport = require('nodemailer-sendgrid-transport');

env.config();

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key:process.env.SENDGRID_API_KEY
    }
}))

exports.getLogin = (req, resp) => {
    const message = req.flash('error');
    resp.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message && message.length > 0 ? message[0] : null
    });
};

exports.postLogin = (req, resp) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
            email: email
        })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                    return resp.redirect('/');
                                });
                        } else {
                            req.flash('error', 'Invalid email or password');
                            return resp.redirect('/login');
                        }
                    })
                    .catch(err => console.error(err));
            } else {
                req.flash('error', 'Invalid email or password');
                return resp.redirect('/login');
            }
        })
        .catch(err => console.error(err));
};

exports.postLogout = (req, resp) => {
    req.session.destroy(err => {
        //console.error(err);
        resp.redirect('/');
    });
};

exports.getSignup = (req, resp) => {
    const message = req.flash('error');
    resp.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message != undefined && message.length > 0 ? message[0] : null
    });
};

exports.postSignup = (req, resp) => {
    const email = req.body.email;
    const pwd = req.body.password;
    const confirmPwd = req.body.confirmPassword;

    User.findOne({
            email: email
        })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email address already exists.');
                return resp.redirect('/signup');
            }

            return bcrypt.hash(pwd, 12)
                .then(hashedPwd => {
                    const user = new User({
                        email: email,
                        password: hashedPwd,
                        cart: {
                            items: []
                        }
                    });
                    return user.save();
                })
                .then(res => {
                    resp.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup succeeded',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
};