const ExchangesFactory = require("../exchanges/factory");

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

    publish(name, specificQueue, message) {
        this.exchanges[name].publish(message, specificQueue);
    }

    _createExchange(name, type, settings) {
        const instance = ExchangesFactory.instantiate(name, type, settings);
        this.exchanges[name = instance;
    }
}

module.exports = AmqpManager;