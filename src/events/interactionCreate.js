/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Interaction} interaction
 */
module.exports = (client, interaction) => {
    if (!interaction.isCommand()) return;

    console.log(`${interaction.user.tag}: /${interaction.commandName}`);

    client.commands.get(interaction.commandName).run(client, interaction);
};
