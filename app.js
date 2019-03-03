const path = require('path');

const express = require('express');
const parser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const error = require('./controllers/error');
const User = require('./models/user');
const mongooseConnect = require('./util/database').mongoConnect;
const dbUri = require('./util/database').dbUri;

const app = express();
const store = new MongoDBStore({
    uri: dbUri,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(parser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, resp, next) => {
    if (req.session.user) {
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => console.error(err));
    } else {
        next();
    }
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes.routes);

app.use(error.get404Page);

mongooseConnect().then(() => {
        app.listen(8080, () => console.log('Listening to port 8080'))
    })
    .catch(err => console.error(err));