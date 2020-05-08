exports.info = {
    command: 'setearning',
    permission: 'Test'
};

exports.run = async (client, msg, args) => {
    try {
        // If no args, use current channel
        const channel = msg.channel.id;

        if (args.length === 0 || isNaN(args[0])) return msg.reply(`You must specify a number to set the XP earning!`);
        const amount = args[0];

        const guildSchema = await client.dbUtils.fetchGuild(msg.guild.id);
        if (!guildSchema) return client.logger.warn(`Unknown Error: Guild Schema doesn't exist`);

        // Make sure its not already there
        const channelSearch = guildSchema.xpChannels.filter(c => (c._id === channel));
        if (channelSearch.length === 0) return msg.reply(`<#${channel}> Doesn't exists`);

        channelSearch[0].xpGain = amount;
        await guildSchema.save();

        client.logger.debug(channelSearch)
        msg.reply(`Successfully set channel ${channel} XP gain to ${amount}!`);

        client.logger.debug(`Set channel ${channel} to XP gain: ${amount}`);
    } catch (err) {
        client.logger.warn(`Unable to set XP earnings for a channel, Error: ${err.stack}`);
    }
}