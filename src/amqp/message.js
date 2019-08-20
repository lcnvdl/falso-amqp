const uuid = require("uuid/v1");

class Message {
    constructor() {
        this.id = uuid();
        this.date = new Date();
        this.content = "";
        this.persistent = false;
        this.retries = 0;
        this.maxRetries = 5;
    }

    initialize(content, { persistent = false }) {
        this.content = content;
        this.persistent = persistent;
    }
}

module.exports = Message;