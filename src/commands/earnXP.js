exports.info = {
    command: 'earnxp',
    permission: 'Test'
};

exports.run = async (client, msg, args) => {
    
    // If no args, use current channel
    let channel;
    if (args.length === 0) channel = msg.channel.id;
    else channel = args[0];
    
    const guildSchema = await client.dbUtils.fetchGuild(msg.guild.id);
    if (!guildSchema) return client.logger.warn(`Unknown Error: Guild Schema doesn't exist`);

    // Make sure its not already there
    if (guildSchema.xpChannels.filter(c => (c._id === channel)).length > 0) return msg.reply(`<#${channel}> Already exists!`);

    guildSchema.xpChannels.push(channel);
    await guildSchema.save();
    msg.reply(`Added <#${channel}>`);
}