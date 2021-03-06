require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const didYouMean = require("didyoumean");

const logger = exports.logger = require('./logger');
const driver = require('./database/driver');

const schemaUtils = require('./database/schemaUtils');

const client = exports.client = new Discord.Client();
client.logger = logger;
client.dbUtils = schemaUtils;

const PREFIX = process.env.PREFIX;
const commands = {};

client.once('ready', () => {
    logger.info(`Successfully signed into Discord... ${client.user.tag}`);
    initCommands();

    // Run database driver
    driver.connect();
});

client.on('message', msg => {
    try {
        if (msg.author.bot || msg.channel.type !== "text") return;

        // Do all the XP in mainchat stuff (Keep below prefix for test)
        schemaUtils.addXpGain(msg.guild.id, msg.channel.id, msg.author.id);

        // Handle all supported commands
        if (!msg.content.startsWith(PREFIX)) return;

        logger.info(PREFIX)
        const command = msg.content.split(' ')[0].substr(PREFIX.length).toLowerCase();
        const args = msg.content.split(' ').splice(1);

        logger.debug(`Trying to run: ${command} - ${args}`);

        if (commands[command]) {
            logger.debug(`Running command ${command} by user ${msg.author.username}`);
            commands[command].run(client, msg, args);
        } else {
            const maybe = didYouMean(command, Object.keys(commands));
            if (maybe) msg.reply(`Did you mean \'${PREFIX}${maybe}\'? :question:`).then(m => {
                m.delete({timeout: 10000}).catch(() => {});
            });
        }
    } catch (err) {
        logger.warn(`Something broke while handing a message, Error: ${err.stack}`);
    }
});

client.on('guildCreate', guild => {
    schemaUtils.fetchGuild(guild.id);
})

const initCommands = () => {
    const commandDir = path.join(__dirname, "commands");
    try {
        logger.debug('Initializing commands...');

        const files = fs.readdirSync(commandDir);
        files.forEach(file => {
            if (!file.startsWith('_') && file.endsWith('.js')) {
                // Is a valid command

                const command = require(path.join(commandDir, file));
                
                if (typeof command.info !== "undefined" && typeof command.info.command === "string" && typeof command.run === "function", typeof command.info.permission !== "undefined") {
                    logger.info(`Loading command: ${file}`);
                    commands[command.info.command] = command;

                } else logger.warn(`Error loading command ${file}, module is incomplete!`);
            }
        })
        logger.debug('Finished loading commands.');
    } catch (err) {
        logger.error(`Unable to load commands, Error: ${err.stack}`)
    }
};

client.login(process.env.TOKEN);