const SocketLayer = require("./socket-layer");
const SocketConnection = require("./socket-io.connection");
const createServer = require("socket.io");

class IOSocketLayer extends SocketLayer {

    constructor() {
        super();
        this.server = null;
    }

    get name() {
        return "io socket layer";
    }

    serve(port) {
        this.server = createServer(port);

        this.server.on("connection", client => {

            let connection = new SocketConnection(this.server, client);
            this.triggerOnConnection(connection);

            client.on("message", msg => {
                connection.triggerOnMessage(msg);
            });

            client.on("disconnect", () => {
                connection.triggerOnClose();
            });

        });

        return Promise.resolve();
    }
}

module.exports = IOSocketLayer;
