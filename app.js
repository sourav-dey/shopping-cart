const path = require('path');

const express = require('express');
const parser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const error = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname)));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(error.get404Page);

app.listen(8080, () => console.log("Listening to port 8080"));