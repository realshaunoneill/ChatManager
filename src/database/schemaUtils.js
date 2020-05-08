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