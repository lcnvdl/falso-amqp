const colog = require("colog");

const settings = require("./settings.json");

const SocketLayer = require("./src/sockets/socket-ws.layer");

const server = new SocketLayer();

server.serve(settings.port).then(() => {

    colog.log(" ");
    colog.success("FALSO AMQP");
    colog.success("Listening on port " + settings.port + " using " + server.name);
    colog.log(" ");

    server.onConnection(connection => {

    });

}, err => {
    colog.error(err);
});