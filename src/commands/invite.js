const Invite = require('../components/Invite');

/**
 * @type {import('discord.js').ApplicationCommandData}
 */
module.exports = {
    description: 'Invite the bot to another server!',
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} i
     */
    run: async (client, i) => {
        i.reply(new Invite(client).toJSON());
    }
};
