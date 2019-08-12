const EventEmitter = require("events");

class SocketLayer {

    constructor() {
        this.events = new EventEmitter();
        this.connections = {};
    }

    /**
     * @returns {string} Name of the socket layer.
     */
    get name() {
        throw new Error("Abstract property");
    }

    /**
     * Starts the server
     * @param {number} port Server port
     */
    serve(port) {
        throw new Error("Abstract method");
    }

    /**
     * Sends a message to each client
     * @param {string} msg Message
     */
    broadcast(msg) {
        Object.values(this.connections).forEach(client => client.send(msg));
    }

    triggerOnConnection(connection) {
        this.connections[connection.id] = connection;
        connection.onClose(() => delete connections[connection.id]);

        this.events.trigger("connection", connection);
    }

    onConnection(callback) {
        this.events.on("connection", callback);
    }
}

module.exports = SocketLayer;
