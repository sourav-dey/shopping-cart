const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const env = require('dotenv');
const crypto = require('crypto');
const sendGridTransport = require('nodemailer-sendgrid-transport');

env.config();

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
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
        errorMessage: message && message.length > 0 ? message[0] : null
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

exports.getResetPassword = (req, resp) => {
    const message = req.flash('error');
    resp.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'Reset Password',
        errorMessage: message && message.length > 0 ? message[0] : null
    });
};

exports.postResetPassword = (req, resp) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.error(err);
            return resp.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found');
                    return resp.redirect('/reset-password');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
                    .then(result => {
                        resp.redirect('/');
                        return transporter.sendMail({
                            to: req.body.email,
                            from: 'shop@node-complete.com',
                            subject: 'Password Reset',
                            html: `
                    <p> You requested a password reset. </p>
                    <p> Click this <a href="http://localhost:8080/reset-password/${token}">link</a> to set a new password</p>
                    `
                        });
                    });
            })
            .catch(err => console.error(err));
    })
};

exports.getNewPassword = (req, resp) => {
    const token = req.params.token;
    User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            const message = req.flash('error');
            resp.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message && message.length > 0 ? message : null,
                userId: user._id.toString()
            });
        })
        .catch(err => console.error(err));
};