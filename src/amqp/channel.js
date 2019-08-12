const uuid = require("uuid/v1");

class Channel {
    constructor(client) {
        this.id = uuid();
        this.client = client;
    }

    /**
     * Attachs an exchange
     * @param {Exchange} exchange Exchange
     */
    attachExchange(exchange) {
    }

    /**
     * Attachs a queue
     * @param {Queue} queue Queue
     */
    attachQueue(queue) {
    }

    /**
     * Binds a queue.
     * @param {string} queueName Queue name
     * @param {string} exchangeName Exchange name
     * @param {string} routingKey Routing Key
     */
    bindQueue(queueName, exchangeName, routingKey) {
    }

    consume(queueName, callback, options) {
    }
}

module.exports = Channel;
