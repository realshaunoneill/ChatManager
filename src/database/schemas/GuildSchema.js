const {Schema} = require('mongoose');

const ChannelSchema = require('./ChannelSchema');

module.exports = new Schema({
  _id: String,
  name: String,
  xpChannels: [ChannelSchema]
});