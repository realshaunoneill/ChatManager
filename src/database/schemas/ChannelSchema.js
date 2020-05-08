const {Schema} = require('mongoose');

module.exports = new Schema({
  _id: String,
  name: String,
  xpGain: {type: Number, default: 1}
});