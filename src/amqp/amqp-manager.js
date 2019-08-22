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
        return Object.values(this.queues);
    }

    get allChannels() {
        return Object.values(this.channels);
    }

    assertDefaultExchange(channel, settings) {
        const name = "";
        const type = "direct";

        if (this.exchanges[name]) {
            this.exchanges[name].validate(type, settings);
        }
        else {
            this._createExchange(name, type, settings);
        }

        channel.attachExchange(this.exchanges[name]);
    }

    assertExchange(channel, name, type, settings) {
        if (!name || name === "") {
            throw new Error("Exchanges must have a name");
        }

        if (this.exchanges[name]) {
            this.exchanges[name].validate(type, settings);
        }
        else {
            this._createExchange(name, type, settings);
        }

        channel.attachExchange(this.exchanges[name]);
    }

    assertQueue(channel, name, settings) {
        if (!name || name === "") {
            name = "amq.get-" + uuid();
        }

        if (this.queues[name]) {
            this.queues[name].validate(settings);
        }
        else {
            this._createQueue(channel, name, settings);
        }

        channel.attachQueue(this.queues[name]);

        return name;
    }

    getQueueStatus(name) {
        let queue = this.queues[name];

        return {
            queue: name,
            messageCount: queue.countMessages,
            consumerCount: this.allChannels.filter(m => m.isConsumming(name)).length
        };
    }

    publish(exchangeName, routingKey, messageContent, settings) {
        const message = new Message();
        message.initialize(messageContent, settings || {});

        const channels = this.allChannels.filter(c => c.hasExchange(exchangeName));
        const allChannelsRelationships = channels.map(channel => channel.getExchangeRelationships(exchangeName));
        const relationships = (allChannelsRelationships.length > 0) ? allChannelsRelationships.reduce((a, b) => a.concat(b)) : [];

        this.exchanges[exchangeName].publish(message, routingKey, relationships);
    }

    processQueues(sendMessageToChannel) {
        const allChannels = this.allChannels;

        this.allQueues.forEach(queue => {
            let messages = queue.process(allChannels).filter(m => m.isPending);

            messages.forEach(queueMessage => {
                const channel = this.channels[queueMessage.deliverTo];
                if (!channel) {
                    queueMessage.setError();
                }
                else {
                    queueMessage.send();
                    sendMessageToChannel(channel, "from-queue", {
                        queue: queue.name,
                        content: queueMessage.message.content,
                        properties: queueMessage.message.properties
                    }).then(() => {
                        queueMessage.finish();
                    }, err => {
                        queueMessage.setError();
                    });
                }
            });
        });
    }

    sendToQueue(channel, queueName, messageContent, settings) {
        this.assertDefaultExchange(channel, {});
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
        if (!this.channels[id]) {
            return;
        }

        this.channels[id].queues
            .filter(queue => queue.exclusive && queue.creator === id)
            .forEach(exclusiveQueue => this.destroyQueue(exclusiveQueue.name));

        try {
            this.channels[id].close();
        }
        catch (err) {
            console.warn(err);
        }

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