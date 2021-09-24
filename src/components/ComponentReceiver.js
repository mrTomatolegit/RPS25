const {
    MessageButton,
    MessageSelectMenu,
    Collection,
    InteractionCollector
} = require('discord.js');
const EventEmitter = require('events');

let INCREMENT = 0;

/**
 *
 * @param {Date|number} timestamp
 * @returns {string}
 */
const generateUniqueKey = (timestamp = Date.now()) => {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();

    if (INCREMENT >= 4095) INCREMENT = 0;
    const concatenated = timestamp.toString(2).concat((INCREMENT++).toString(2));
    return parseInt(concatenated, 2).toString(32);
};

/**
 * @type {Map<string, ComponentReceiver>}
 */
const receivers = new Map();

/**
 *
 * @typedef {import("discord.js").Client} Client
 * @typedef {import('discord.js').TextChannel} TextChannel
 * @typedef {import('discord.js').User} User
 * @typedef {import('discord.js').MessageComponentInteraction} MessageComponentInteraction
 * @typedef {import('discord.js').InteractionCollectorOptions<MessageComponentInteraction>} InteractionCollectorOptions
 */
class ComponentReceiver extends EventEmitter {
    /**
     * @param {Client} client
     * @param {string} channelId
     * @param {User[]} users
     * @param {InteractionCollectorOptions} options
     */
    constructor(client, channelId, users, options) {
        super();

        if (options.solo) {
            users.forEach(user => {
                if (receivers.has(user.id)) receivers.get(user.id).stop();
                receivers.set(user.id, this);
            });
        }

        /**
         * @type {Client}
         */
        this.client = client;

        this.channelId = channelId;

        this.users = new Collection(users.map(u => [u.id, u]));

        this.uniqueKey = generateUniqueKey();

        this.messages = [];

        const baseOptions = {
            filter: i =>
                this.users.has(i.user.id) &&
                i.customId?.includes(this.uniqueKey) &&
                i.channelId === this.channelId &&
                ('filter' in options ? options.filter(i) : true)
        };

        if ('filter' in options) delete options.filter;
        if ('solo' in options) delete options.solo;

        Object.assign(baseOptions, options);

        this.collector = new InteractionCollector(client, baseOptions);

        this.collector.on('collect', i => this.emit(i.customId, i));

        this.collector.on('end', collected => {
            if (this.collector.endReason == null) this.emit('timeout', collected);
            else this.emit('end', collected);
        });
    }

    get isActive() {
        return !this.collector.ended;
    }

    stop() {
        this.collector.stop('stopped');
    }

    createButton(customId) {
        return new MessageButton().setDisabled(!this.isActive).setCustomId(customId);
    }

    createSelectMenu(customId) {
        return new MessageSelectMenu().setDisabled(!this.isActive).setCustomId(customId);
    }

    toJSON() {
        return {
            content: 'No message was rendition made'
        };
    }

    static get receivers() {
        return receivers;
    }

    static disableAllComponents(messageData) {
        messageData.components?.forEach(ar => ar.components.forEach(c => c.setDisabled(true)));
        return messageData;
    }
}

module.exports = ComponentReceiver;
