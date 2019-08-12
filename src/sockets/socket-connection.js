const EventEmitter = require("events");
const uuid = require("uuid/v1");

class SocketConnection {
    constructor(server, client) {
        this.id = uuid();
        this.server = server;
        this.client = client;
        this.events = new EventEmitter();
    }

    triggerOnMessage(msg) {
        this.events.trigger("message", msg);
    }

    triggerOnClose() {
        this.events.trigger("close", this);
    }

    send(message) {
        throw new Error("Abstract method");
    }

    broadcast(message) {
        this.server.broadcast(message);
    }

    onMessage(callback) {
        this.events.on("message", callback);
    }

    onClose(callback) {
        this.events.on("close", callback);
    }
}

module.exports = SocketConnection;
