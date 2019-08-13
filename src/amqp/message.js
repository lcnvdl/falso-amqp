class Message {
    constructor() {
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