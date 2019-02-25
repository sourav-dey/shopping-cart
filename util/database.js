const mongodb = require('mongodb');
const env = require('dotenv')

env.config();

let _db;
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://' + process.env.MONGO_DB_USER + ':' + process.env.MONGO_DB_PWD + '@cluster0-qkyap.mongodb.net/shop?retryWrites=true';

const mongoConnect = callback => {
MongoClient.connect(url, { useNewUrlParser: true})
    .then(client => {
        console.log('Connected');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.error(err);
        throw err;
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;