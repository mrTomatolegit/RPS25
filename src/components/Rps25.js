const { MessageEmbed, MessageActionRow } = require('discord.js');
const ComponentReceiver = require('./ComponentReceiver');

const choices = {
    rps: require('../choices/rps.json'),
    rps5: require('../choices/rps5.json'),
    rps7: require('../choices/rps7.json'),
    rps9: require('../choices/rps9.json'),
    rps11: require('../choices/rps11.json'),
    rps15: require('../choices/rps15.json'),
    rps25: require('../choices/rps25.json')
};

const emojis = require('../emojis.json');

const outcomes = require('../outcomes.json');

class Rps25 extends ComponentReceiver {
    /**
     * @param {import('discord.js').Client} client
     * @param {string} channelId
     * @param {import('discord.js').User[]} users
     * @param {"rps25"|"rps15"|"rps11"|'rps9'|'rps7'|'rps5'|'rps3'} gamemode
     */
    constructor(client, channelId, users, gamemode = 'rps25') {
        super(client, channelId, users, {
            idle: 30000,
            time: 120000
        });

        this.gamemode = gamemode;

        this.embedColor = null;

        this.selectedMoves = new Map();

        this.on(this.selectChoiceId, i => {
            if (this.selectedMoves.has(i.user.id)) return i.deferUpdate();
            this.selectedMoves.set(i.user.id, i.values[0]);

            if (this.users.has(this.client.user.id)) {
                if (!this.selectedMoves.has(this.client.user.id))
                    this.selectedMoves.set(
                        this.client.user.id,
                        this.choices[Math.floor(Math.random() * this.choices.length)]
                    );
            }

            i.update(this.toJSON());
        });
    }

    get choices() {
        return choices[this.gamemode];
    }

    get isFinished() {
        return this.selectedMoves.size === 2;
    }

    get components() {
        const base = [];
        if (!this.isFinished)
            base.push(new MessageActionRow().addComponents(this.makeSelectChoice()));

        return base;
    }

    get selectChoiceId() {
        return `selectchoice${this.uniqueKey}`;
    }

    makeEmbed() {
        let description = 'Select a choice from the dropdown menu:\n\n';
        const users = [...this.users.values()];
        const values = [...this.selectedMoves.values()];

        if (this.isFinished) {
            this.stop();

            const choice1 = values[0];
            const choice2 = values[1];
            const win1 = outcomes[choice1].includes(choice2);

            description = `Game has ended!\n\n**${users[0].tag}**: ${emojis[choice1]} \`${choice1}\`\n\n**${users[1].tag}**: ${emojis[choice2]} \`${choice2}\`\n\n`;

            if (choice1 === choice2) {
                description = description + "It's a tie!";
            } else if (win1) {
                description = description + `${users[0]} wins!`;
            } else {
                description = description + `${users[1]} wins!`;
            }
        } else {
            this.users.forEach(user => {
                const hasSelected = this.selectedMoves.has(user.id);
                description =
                    description +
                    (hasSelected
                        ? `**${user.tag} has chosen their move!**\n\n`
                        : `*${user.tag} is choosing their move...*\n\n`);
            });
        }

        const embed = new MessageEmbed()
            .setTitle(this.gamemode.toUpperCase())
            .setDescription(description)
            .setColor(this.embedColor ?? 'RANDOM')
            .setTimestamp()
            .setFooter('Game ID: ' + this.uniqueKey);
        this.embedColor = embed.color;
        return embed;
    }

    makeSelectChoice() {
        return this.createSelectMenu(this.selectChoiceId)
            .setPlaceholder('Select a move')
            .addOptions(
                this.choices.map(c => {
                    return {
                        label: c.toUpperCase(),
                        value: c,
                        description: outcomes[c].filter(c => this.choices.includes(c)).join(' • '),
                        emoji: emojis[c]
                    };
                })
            );
    }

    toJSON() {
        return {
            embeds: [this.makeEmbed()],
            components: this.components
        };
    }
}

module.exports = Rps25;
