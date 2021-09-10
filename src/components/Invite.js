const { MessageActionRow, MessageButton } = require('discord.js');

class Invite {
    constructor(client) {
        this.client = client;
    }

    get components() {
        return [new MessageActionRow().addComponents(this.makeInviteLink())];
    }

    makeInviteLink() {
        return new MessageButton()
            .setStyle('LINK')
            .setLabel('Invite')
            .setURL(
                this.client.generateInvite({
                    scopes: ['applications.commands', 'bot']
                })
            );
    }

    toJSON() {
        return {
            content: 'Press the button to invite the bot',
            components: this.components
        };
    }
}

module.exports = Invite;
