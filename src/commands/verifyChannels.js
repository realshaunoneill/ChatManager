exports.info = {
    command: 'verifychannels',
    permission: 'Test'
};

exports.run = async (client, msg, args) => {
    
    const guildSchema = await client.dbUtils.fetchGuild(msg.guild.id);

    let message = '';
    guildSchema.xpChannels.forEach(channelId => {
        message += `\n${channelId._id} -> <#${channelId._id}>\n`;
    });

    msg.reply(message);
}