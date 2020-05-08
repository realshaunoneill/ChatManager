require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const didYouMean = require("didyoumean");

const logger = require('./logger');

const client = exports.client = new Discord.Client();
client.logger = logger;

const PREFIX = process.env.PREFIX;
const commands = {};

client.once('ready', () => {
    logger.info(`Successfully signed into Discord... ${client.user.tag}`);
    initCommands();
});

client.on('message', msg => {
    try {
        if (msg.author.bot || msg.channel.type !== "text") return;
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
}

client.login(process.env.TOKEN);