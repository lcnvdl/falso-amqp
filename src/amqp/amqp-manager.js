const ExchangesFactory = require("../exchanges/factory");
const Channel = require("./channel");

class AmqpManager {

    constructor() {
        this.channels = {};
        this.exchanges = {};
        this.queues = {};
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

    publish(name, routingKey, message, options) {
        this.exchanges[name].publish(message, routingKey);
    }

    createChannel(client) {
        const channel = new Channel(client);
        this.channels[channel.id] = channel;
        return channel;
    }
    
    closeChannel(id) {
        delete this.channels[id];
    }

    _createExchange(name, type, settings) {
        const instance = ExchangesFactory.instantiate(name, type, settings);
        this.exchanges[name] = instance;
    }
}

module.exports = AmqpManager;