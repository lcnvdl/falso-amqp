const SocketConnection = require("./socket-connection");

class WsSocketConnection extends SocketConnection {
    send(msg) {
        this.client.send(msg);
    }
}

module.exports = WsSocketConnection;
