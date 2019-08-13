const ExchangesFactory = require("../exchanges/factory");
const Channel = require("./channel");
const Message = require("./message");
const Queue = require("../queues/queue");
const uuid = require("uuid/v1");

class AmqpManager {

    constructor() {
        this.channels = {};
        this.exchanges = {};
        this.queues = {};
    }

    get allQueues() {
        return Object.values(queues);
    }

    get allChannels() {
        return Object.values(channels);
    }

    assertExchange(channel, name, type, settings) {
        if (this.exchanges[name]) {
            this.exchanges[name].validate(type, settings);
        }
        else {
            this._createExchange(name, type, settings);
        }

        channel.attachExchange(this.exchanges[name]);
    }

    assertQueue(channel, name, settings) {
        if (name === "") {
            name = "amq.get-" + uuid();
        }

        if (this.queues[name]) {
            this.queues[name].validate(settings);
        }
        else {
            this._createQueue(channel, name, settings);
        }

        channel.attachQueue(this.queues[name]);
    }

    publish(exchangeName, routingKey, messageContent, settings) {
        const message = new Message();
        message.initialize(messageContent, settings || {});

        const channels = this.allChannels.filter(c => c.hasExchange(exchangeName));
        const relationships = channels.map(channel => channel.getExchangeRelationships(exchangeName));

        this.exchanges[exchangeName].publish(message, routingKey, relationships);
    }

    sendToQueue(channel, queueName, messageContent, settings) {
        this.assertExchange(channel, "", "direct", {});
        channel.bindQueue(queueName, "", queueName);
        this.publish("", queueName, messageContent, settings);
    }

    createChannel(client) {
        const channel = new Channel(client);
        this.channels[channel.id] = channel;
        return channel;
    }

    destroyQueue(name) {
        delete this.queues[name];
    }

    closeChannel(id) {
        this.channels[id].queues
            .map(name => this.queues[name])
            .filter(queue => queue.exclusive && queue.creator === id)
            .forEach(exclusiveQueue => this.destroyQueue(exclusiveQueue.name));

        delete this.channels[id];
    }

    _createExchange(name, type, settings) {
        const instance = ExchangesFactory.instantiate(name, type, settings);
        this.exchanges[name] = instance;
    }

    _createQueue(channel, name, settings) {
        const instance = new Queue();
        instance.initialize(name, settings);
        instance.creator = channel.id;
        this.queues[name] = instance;
    }
}

module.exports = AmqpManager;