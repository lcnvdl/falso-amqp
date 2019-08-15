const uuid = require("uuid/v1");

class Channel {
    constructor(client) {
        this.id = uuid();
        this.client = client;
        this.prefetch = 0;
        this.relationships = [];
        this.queues = [];
        this.exchanges = [];
        this.consuming = {};
    }

    /**
     * True if it has a binded exchange
     * @param {string} name Exchange name
     * @returns {boolean} True if it has a binded exchange 
     */
    hasExchange(name) {
        return this.relationships.some(m => m.exchangeName === name);
    }

    /**
     * Attachs an exchange
     * @param {Exchange} exchange Exchange
     */
    attachExchange(exchange) {
        if (!this.exchanges.some(m => m.name === exchange.name)) {
            this.exchanges.push(exchange);
        }
    }

    /**
     * Attachs a queue
     * @param {Queue} queue Queue
     */
    attachQueue(queue) {
        if (!this.queues.some(m => m.name === queue.name)) {
            this.queues.push(queue);
        }
    }

    /**
     * Binds a queue.
     * @param {string} queueName Queue name
     * @param {string} exchangeName Exchange name
     * @param {string} routingKey Routing Key
     */
    bindQueue(queueName, exchangeName, routingKey) {
        let queue = this.queues.find(m => m.name === queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not found in channel ${this.id}`);
        }

        if (!this.relationships.some(r =>
            r.queueName === queueName &&
            r.exchangeName === exchangeName &&
            r.routingKey === routingKey)) {
            this.relationships.push({ queueName, exchangeName, routingKey, queue });
        }
    }

    getExchangeRelationships(name) {
        return this.relationships.filter(m => m.exchangeName === name);
    }

    isConsumming(queue) {
        return !!this.consuming[queue];
    }

    consume(queueName, settings) {
        this.consuming[queueName] = {
            settings
        };
    }
}

module.exports = Channel;
