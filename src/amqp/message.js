const uuid = require("uuid/v1");

class Message {
    constructor() {
        this.id = uuid();
        this.date = new Date();
        this.content = "";
        this.persistent = false;
        this.retries = 0;
        this.maxRetries = 5;
        this.properties = {};
        this._relationship = null;
    }

    initialize(content, settings) {
        const { persistent = false } = settings;
        
        this.content = content;
        this.persistent = persistent;
        this.properties = settings;
    }

    serialize() {
        let obj = Object.assign({}, this);
        Object.keys(obj).filter(m => m[0] === "_").forEach(m => delete obj[m]);
        return obj;
    }

    deserialize(data) {
        Object.assign(this, data);
        return this;
    }
}

module.exports = Message;