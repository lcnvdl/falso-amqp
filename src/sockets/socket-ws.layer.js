const { Server } = require("ws");
const SocketLayer = require("./socket-layer");
const SocketConnection = require("./socket-ws.connection");

class WsSocketLayer extends SocketLayer {

    constructor() {
        super();
        this.server = null;
    }

    get name() {
        return "ws socket layer";
    }

    serve(port) {
        this.server = new Server({ port });

        this.server.on("connection", client => {

            let connection = new SocketConnection(this.server, client);
            this.triggerOnConnection(connection);

            client.on("message", msg => {
                connection.triggerOnMessage(msg);
            });

            client.on("close", () => {
                connection.triggerOnClose();
            });

        });

        return Promise.resolve();
    }
}

module.exports = WsSocketLayer;
