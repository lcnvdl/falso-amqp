const SocketConnection = require("./socket-connection");

class IoSocketConnection extends SocketConnection {
    send(msg) {
        this.client.emit("message", msg);
    }

    close() {
        this.client.disconnect();
    }
}

module.exports = IoSocketConnection;
