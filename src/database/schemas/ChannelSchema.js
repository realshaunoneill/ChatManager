const {Schema} = require('mongoose');

module.exports = new Schema({
  _id: String,
  xpPerMessage: {type: Number, default: 1}
});