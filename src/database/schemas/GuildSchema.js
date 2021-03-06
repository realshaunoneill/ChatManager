const {Schema} = require('mongoose');

const ChannelSchema = require('./ChannelSchema');
const UserSchema = require('./UserSchema');

module.exports = new Schema({
  _id: String,
  name: String,
  xpChannels: [ChannelSchema],
  users: [UserSchema]
});