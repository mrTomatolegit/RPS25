const Rps25 = require('../components/Rps25');

/**
 * @type {import('discord.js').ApplicationCommandData}
 */
module.exports = {
    description: 'Play rps!',
    options: [
        {
            name: 'gamemode',
            description: 'Which type of rps would you like to play?',
            type: 'STRING',
            choices: [
                { name: '3 choices', value: 'rps' },
                { name: '5 choices', value: 'rps5' },
                { name: '7 choices', value: 'rps7' },
                { name: '9 choices', value: 'rps9' },
                { name: '11 choices', value: 'rps11' },
                { name: '15 choices', value: 'rps15' },
                { name: '25 choices', value: 'rps25' }
            ]
        },
        {
            name: 'opponent',
            description: 'Who would you like to challenge?',
            type: 'USER'
        }
    ],
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} i
     */
    run: async (client, i) => {
        const user = i.options.getUser('opponent', false);
        const rps = new Rps25(
            client,
            i.channelId,
            [i.user, (user?.id !== i.user.id ? user : client.user) || client.user],
            i.options.getString('gamemode', false) || 'rps25'
        );
        i.reply(rps.toJSON());

        rps.on('end', () => {
            i.editReply(Rps25.disableAllComponents(rps.toJSON()));
        });
        rps.on('timeout', () => {
            i.editReply(Rps25.disableAllComponents(rps.toJSON()));
        });
    }
};
