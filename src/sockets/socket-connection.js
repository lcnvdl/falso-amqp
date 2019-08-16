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
        this.events.emit("message", msg);
    }

    triggerOnClose() {
        this.events.emit("close", this);
    }

    send(_message) {
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

    close() {
        throw new Error("Abstract method");
    }
}

module.exports = SocketConnection;
