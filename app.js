const path = require('path');

const express = require('express');
const parser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error = require('./controllers/error');
const User = require('./models/user');
const mongooseConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(parser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname)));

app.use((req, resp, next) => {
    User.findById('5c778ed622918c48303dce22')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.error(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(error.get404Page);

mongooseConnect().then(() => {
        User.findById('5c778ed622918c48303dce22')
            .then(user => {
                if (!user) {
                    const newUser = new User({
                        name: 'Sourav',
                        email: 'sourav.dey9@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    newUser.save();
                }
            })
            .catch(err => console.error(err));

        app.listen(8080, () => console.log('Listening to port 8080'))
    })
    .catch(err => console.error(err));