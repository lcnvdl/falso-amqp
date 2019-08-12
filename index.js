const colog = require("colog");

const settings = require("./settings.json");

const SocketLayer = require("./src/sockets/socket-ws.layer");

const Protocol = requrie("./src/protocols/protocol-v1");

const Manager = require("./src/amqp/amqp-manager");

const server = new SocketLayer();
const JsonHelper = require("./src/helpers/json.helper");

server.serve(settings.port).then(() => {

    colog.log(" ");
    colog.success("FALSO AMQP");
    colog.success("Listening on port " + settings.port + " using " + server.name);
    colog.log(" ");

    let manager = new Manager();

    server.onConnection(connection => {
        let channel = null;

        connection.onMessage(msg => {
            try {
                const { cmd, data, msgID } = Protocol.parse(msg);

                if (cmd === "new-channel" || cmd === "nc") {
                    channel = manager.createChannel(connection);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
                else if (cmd === "assert-exchange" || cmd === "ae") {
                    throw new Error("Not implemented");
                }
                else if (cmd === "assert-queue" || cmd === "aq") {
                    throw new Error("Not implemented");
                }
                else if (cmd === "bind-queue" || cmd === "bq") {
                    const { queueName, exchangeName, routingKey } = data;
                    channel.bindQueue(queueName, exchangeName, routingKey);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
                else if (cmd === "publish" || cmd === "p") {
                    const { exchangeName, routingKey, message } = data;
                    throw new Error("Not implemented");
                }
            }
            catch (err) {
                connection.send(err);
            }
        });

        connection.onClose(() => {
            manager.closeChannel(channel.id);
        });
    });

}, err => {
    colog.error(err);
});