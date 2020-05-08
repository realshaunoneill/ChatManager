const logger = require('../logger');

const mongoose = require('mongoose');
let db = exports.db = null;

exports.connect = async () => {
    try {

        mongoose.connect(`mongodb://${process.env.DATABASE}`, {
            keepAlive: 120,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(err => {
            logger.error(`Unable to open database connection, Error: ${err.stack}`);
            return false;
        });

        db = mongoose.connection;
        mongoose.Promise = global.Promise;

        loadSchemas();

        db.on('err', (err) => {
            logger.error(`An error occurred starting the database, Error: ${err.stack}`);
            return false;
        });

        db.once('open', function () {
            return true;
        });
    } catch (err) {
        logger.error(`Error connecting to the database, Error: ${err.stack}`);
    }
};

exports.getModals = function () {
    return mongoose.models;
};

exports.getConnection = function () {
    return mongoose.connection;
};

function loadSchemas() {
    mongoose.model('Guild', require('./schemas/GuildSchema'));
}