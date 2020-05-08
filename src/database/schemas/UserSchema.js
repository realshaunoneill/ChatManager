const {Schema} = require('mongoose');

const ChannelSchema = require('./ChannelSchema');

module.exports = new Schema({
  _id: String,
  username: String,
  currentXP: {type: Number, default: 0},
});