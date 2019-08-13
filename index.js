const colog = require("colog");

const settings = require("./settings.json");

const SocketLayer = require("./src/sockets/socket-ws.layer");

const Protocol = require("./src/protocols/protocol-v1");

const Manager = require("./src/amqp/amqp-manager");

const server = new SocketLayer();

server.serve(settings.port).then(() => {

    logo();

    colog.success("Listening on port " + settings.port + " using " + server.name);

    let manager = new Manager();

    server.onConnection(connection => {
        let channel = null;

        connection.onMessage(msg => {
            try {
                const { cmd, data, msgID } = Protocol.parse(msg);

                if (cmd === "new-channel" || cmd === "nc") {
                    colog.info("New channel");

                    channel = manager.createChannel(connection);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
                else if (cmd === "assert-exchange" || cmd === "ae") {
                    const { name, type, settings } = data;
                    logChannel(channel.id, `Assert exchange ${type} with name ${name}`);

                    manager.assertExchange(channel, name, type, settings);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
                else if (cmd === "assert-queue" || cmd === "aq") {
                    const { name, settings } = data;
                    logChannel(channel.id, `Assert queue ${name}`);

                    manager.assertQueue(channel, name, settings);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
                else if (cmd === "bind-queue" || cmd === "bq") {
                    const { queueName, exchangeName, routingKey } = data;
                    logChannel(channel.id, `Bind queue ${queueName} with exchange ${exchangeName} using RK ${routingKey}`);

                    channel.bindQueue(queueName, exchangeName, routingKey);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
                else if (cmd === "publish" || cmd === "p") {
                    const { exchangeName, routingKey, content, settings } = data;
                    logChannel(channel.id, `Publish message in exchange ${exchangeName} using RK ${routingKey}`);

                    manager.publish(exchangeName, routingKey, content, settings);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
                else if (cmd === "send-to-queue" || cmd === "sq") {
                    const { queueName, content, settings } = data;
                    logChannel(channel.id, `Send message to queue ${queueName}`);

                    manager.sendToQueue(queueName, content, settings);
                    let reply = protocol.prepare(cmd, true, msgID);
                    connection.send(reply);
                }
            }
            catch (err) {
                connection.send(err);
                colog.error(err);
            }
        });

        connection.onClose(() => {
            manager.closeChannel(channel.id);
        });
    });

}, err => {
    colog.error(err);
});

function logChannel(id, message) {
    colog.log(colog.colorGreen(id) + ": " + colog.colorWhite(message));
}

function logo() {
    colog.log(" ");
    colog.log(colog.bgBlue("                    "));
    colog.log(colog.colorBlue(
        colog.bgWhite("    FALSO") +
        colog.bgYellow("  ") +
        colog.bgWhite("AMQP     ")));
    colog.log(colog.colorCyan(colog.bgBlue(" lucianorasente.com ")));
    colog.log(" ");
}