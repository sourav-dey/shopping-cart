const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, resp) => {
    resp.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
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
                            return resp.redirect('/login');
                        }
                    })
                    .catch(err => console.error(err));
            } else {
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
    resp.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
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
                    return resp.redirect('/login');
                });
        })
        .catch(err => console.error(err));
};