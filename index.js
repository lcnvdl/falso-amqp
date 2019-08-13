const colog = require("colog");
const process = require("process");

const settings = require("./settings.json");

const SocketLayer = require("./src/sockets/socket-io.layer");
//const SocketLayer = require("./src/sockets/socket-ws.layer");

const Protocol = require("./src/protocols/protocol-v1");

const Manager = require("./src/amqp/amqp-manager");

const server = new SocketLayer();

const args = process.argv.splice(2);

let devMode = false;

if (args.indexOf("--dev") !== -1) {
    devMode = true;

    colog.log(colog.bgBlack(colog.colorGreen("DEV MODE")));
}

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
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                    return;
                }
                else if (!channel) {
                    throw new Error("Invalid channel");
                }

                if (cmd === "prefetch" || cmd === "pf") {
                    const { number } = data;
                    logChannel(channel.id, `Prefetch ${number} channel`);

                    channel.prefetch = number;
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                }
                else if (cmd === "assert-exchange" || cmd === "ae") {
                    const { name, type, settings } = data;
                    logChannel(channel.id, `Assert exchange ${type} with name ${name}`);

                    manager.assertExchange(channel, name, type, settings);
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                }
                else if (cmd === "assert-queue" || cmd === "aq") {
                    const { name, settings } = data;
                    logChannel(channel.id, `Assert queue ${name}`);

                    manager.assertQueue(channel, name, settings);
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                }
                else if (cmd === "bind-queue" || cmd === "bq") {
                    const { queueName, exchangeName, routingKey } = data;
                    logChannel(channel.id, `Bind queue ${queueName} with exchange ${exchangeName} using RK ${routingKey}`);

                    channel.bindQueue(queueName, exchangeName, routingKey);
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                }
                else if (cmd === "publish" || cmd === "p") {
                    const { exchangeName, routingKey, content, settings } = data;
                    logChannel(channel.id, `Publish message in exchange ${exchangeName} using RK ${routingKey}`);

                    manager.publish(exchangeName, routingKey, content, settings);
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                }
                else if (cmd === "consume" || cmd == "cn") {
                    const { queueName, settings } = data;
                    logChannel(channel.id, `Consume queue ${queueName}`);

                    channel.consume(queueName, settings);
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                }
                else if (cmd === "send-to-queue" || cmd === "sq") {
                    const { queueName, content, settings } = data;
                    logChannel(channel.id, `Send message to queue ${queueName}`);

                    manager.sendToQueue(queueName, content, settings);
                    let reply = Protocol.prepare(cmd, {}, msgID);
                    connection.send(reply);
                }
            }
            catch (err) {

                let reply;

                if (typeof err === 'string') {
                    reply = Protocol.prepare("error", {
                        message: err,
                        object: {},
                        stack: ""
                    });
                }
                else {
                    reply = Protocol.prepare("error", {
                        message: "" + err,
                        object: err,
                        stack: err.stack
                    });
                }

                connection.send(reply);
                colog.error(err);

                if (devMode) {
                    throw err;
                }
            }
        });

        connection.onClose(() => {
            if (channel) {
                manager.closeChannel(channel.id);
            }
        });
    });

    let processQueueTimer = 0;

    function processQueue() {
        if (processQueueTimer) {
            clearTimeout(processQueueTimer);
            processQueueTimer = 0;
        }

        manager.processQueues((channel, cmd, message) => {
            logChannel(channel.id, "Sending " + cmd + " to channel");
            let messagePackage = Protocol.prepare(cmd, message);
            channel.client.send(messagePackage);
            return Promise.resolve();
        });

        processQueueTimer = setTimeout(() => processQueue(), settings.processQueueInterval || 1000);
    }

    setTimeout(() => processQueue(), settings.processQueueInterval);
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