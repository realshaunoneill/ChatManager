const index = require('../index');
const logger = require('../logger');
const driver = require('./driver');

/**
 * Returns a guild modal or creates one if it doesn't exist
 * @param id Guild ID
 */
exports.fetchGuild = async (id) => {
    try {

      // Make sure it doesn't already exist
      let guildModal = await driver.getModals().Guild.findById(id);
      if (guildModal) return guildModal;

      guildModal = new driver.getModals().Guild({
        _id: id.toString(),
        name: index.client.guilds.cache.get(id).name
      });
      logger.debug(`Saved new guild to database: ${id}`);
      return (await guildModal.save());

    } catch (err) {
      logger.warn(`Unable to save new guild to database: ${id}, Error: ${err.stack}`);
    }
};

exports.fetchChannelGain = async (guildID, channelID) => {
  try {
    const guildModal = await exports.fetchGuild(guildID);
    const channels = guildModal.xpChannels.filter(c => c._id === channelID);
    if (channels.length === 0) return 0;
    else return channels[0].xpGain;

  } catch (err) {
    logger.warn(`Unable to fetch channel gain: ${guildID}, ${channelID}, Error: ${err.stack}`);
  }
};

exports.ensureUserExists = async (guildID, userID) => {
  try {
    
    const guildModal = await exports.fetchGuild(guildID);
    const guild = index.client.guilds.cache.get(guildID);
    const member = await guild.members.fetch(userID);

    const users = guildModal.users.filter(u => u._id === userID);
    if (users.length === 0) {
      logger.debug(`User ${userID} doesn't exist... creating`);
      guildModal.users.push({
        _id: userID,
        username: member.displayName
      });
    }
    return await guildModal.save();
  } catch (err) {
    logger.warn(`Unable to fetch guild user, ${guildID}, ${userID}, Error: ${err.stack}`);
  }
}

exports.addXpGain = async (guildID, channelID, userID) => {
  try {

    const guildModal = await exports.fetchGuild(guildID);
    const channelGain = await exports.fetchChannelGain(guildID, channelID);
    if (channelGain === 0) return;

    // Ensure user exists
    await exports.ensureUserExists(guildID, userID);

    logger.debug(`Adding ${channelGain} for user ${userID}..`);

    const user = guildModal.users.filter(u => u._id === userID);
    if (user[0]) user[0].currentXP += channelGain;

    await guildModal.save();

  } catch (err) {
    logger.warn(`Unable to add XP gain to user: ${guildID}, ${channelID}, ${userID}, Error: ${err.stack}`);
  }
}