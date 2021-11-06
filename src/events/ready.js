const { ApplicationCommand } = require('discord.js');

/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Interaction} interaction
 */
module.exports = client => {
    console.log(`Logged in as ${client.user.tag}`);

    client.application.commands.set(
        client.commands.map(
            c =>
                new ApplicationCommand(client, {
                    name: c.name,
                    description: c.description,
                    options: c.options
                })
        ),
        process.isTesting ? client.config.guildId : undefined
    );
};
