class AmqpManager {

    constructor() {
        this.exchanges = {};
        this.queues = {};
    }

    assertExchange(name, type, settings) {
        if (this.exchanges[name]) {
            this.exchanges[name].validate(type, settings);
        }
        else {
            this._createExchange(name, type, settings);
        }
    }

    publish(name, specificQueue, message) {
        this.exchanges[name].publish(message, specificQueue);
    }

    _createExchange(name, type, settings) {
    }
}

module.exports = AmqpManager;