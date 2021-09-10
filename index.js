'use strict';
require('dotenv').config();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
process.isTesting = process.argv.includes('--testing');

const client = new Client({ intents: ['GUILD_INTEGRATIONS'] });

client.config = require('./config.json');

client.commands = new Collection();

const commands = fs.readdirSync('./src/commands');
commands.forEach(command => {
    const commandName = command.split('.')[0];
    const props = require(`./src/commands/${command}`);

    props.name = commandName;
    client.commands.set(commandName, props);
});

const events = fs.readdirSync('./src/events');
events.forEach(event => {
    const eventName = event.split('.')[0];
    const props = require(`./src/events/${event}`);

    client.on(eventName, props.bind(null, client));
});

client.login();
