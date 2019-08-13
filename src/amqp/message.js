class Message {
    constructor() {
        this.content = "";
        this.persistent = false;
    }

    initialize(content, { persistent = false }) {
        this.content = content;
        this.persistent = persistent;
    }
}

module.exports = Message;