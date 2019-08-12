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
}

module.exports = Channel;
