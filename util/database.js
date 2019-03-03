const mongoose = require('mongoose');
const env = require('dotenv')

env.config();

const url = 'mongodb+srv://' + process.env.MONGO_DB_USER + ':' + process.env.MONGO_DB_PWD + '@cluster0-qkyap.mongodb.net/shop';

mongoose.set('useFindAndModify', false);
const mongoConnect = callback => {
    return mongoose.connect(url, {useNewUrlParser: true})
}

exports.mongoConnect = mongoConnect;
exports.dbUri = url;