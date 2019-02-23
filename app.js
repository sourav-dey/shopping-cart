const path = require('path');

const express = require('express');
const parser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(parser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname)));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(error.get404Page);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});

User.hasMany(Product);

sequelize.sync({
        force: true
    }).then(
        result => {
            app.listen(8080, () => console.log("Listening to port 8080"));
        })
    .catch(err => console.error(err));