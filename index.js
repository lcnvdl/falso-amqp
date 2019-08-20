const colog = require("colog");
const process = require("process");

const settings = require("./settings.json");

const SocketLayer = require("./src/sockets/socket-" + settings.sockets.layer + ".layer");
const { logo, logChannel } = require("./src/helpers/ux.helper");
const Protocol = require("./src/protocols/protocol-v1");

const Manager = require("./src/amqp/amqp-manager");
const MainController = require("./src/controller/main.controller");

function runServer() {

    const server = new SocketLayer();

    let devMode = false;

    const args = process.argv.splice(2);

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === "--dev") {
            devMode = true;
            colog.log(colog.bgBlack(colog.colorGreen("DEV MODE")));
        }
        else if (arg === "--port" || arg === "-p") {
            settings.port = +args[++i];
        }
        else if (arg === "--process-queue-interval" || arg === "-pqi") {
            settings.processQueueInterval = +args[++i];
        }
        else if (arg === "--version" || arg === "-v") {
            logo();
            return;
        }
    }

    server.serve(settings.port).then(() => {

        logo();

        colog.success("Listening on port " + settings.port + " using " + server.name);

        let manager = new Manager();

        server.onConnection(connection => {
            let controller = new MainController({ manager, connection, Protocol });

            connection.onMessage(msg => {
                try {
                    const { cmd, data, msgID } = Protocol.parse(msg);

                    if (cmd === "new-channel" || cmd === "nc") {
                        colog.info("New channel");
                        controller.newChannel({ cmd, msgID });
                    }
                    else if (!controller.hasChannel) {
                        colog.warning("Channel needed");
                        controller.requestChannel();
                    }
                    else if (cmd === "prefetch" || cmd === "pf") {
                        const { number } = data;
                        logChannel(controller.channel.id, `Prefetch ${number} channel`);
                        controller.prefetch(number, { cmd, msgID });
                    }
                    else if (cmd === "assert-exchange" || cmd === "ae") {
                        const { name, type, settings } = data;
                        logChannel(controller.channel.id, `Assert exchange ${type} with name ${name}`);
                        controller.assertExchange(name, type, settings, { cmd, msgID });
                    }
                    else if (cmd === "assert-queue" || cmd === "aq") {
                        const { name, settings } = data;
                        logChannel(controller.channel.id, `Assert queue ${name}`);
                        controller.assertQueue(name, settings, { cmd, msgID });
                    }
                    else if (cmd === "bind-queue" || cmd === "bq") {
                        const { queueName, exchangeName, routingKey } = data;
                        logChannel(controller.channel.id, `Bind queue ${queueName} with exchange ${exchangeName} using RK ${routingKey}`);
                        controller.bindQueue(queueName, exchangeName, routingKey, { cmd, msgID });
                    }
                    else if (cmd === "publish" || cmd === "p") {
                        const { exchangeName, routingKey, content, settings } = data;
                        logChannel(controller.channel.id, `Publish message in exchange ${exchangeName} using RK ${routingKey}`);
                        controller.publish(exchangeName, routingKey, content, settings, { cmd, msgID });
                        processQueue();
                    }
                    else if (cmd === "consume" || cmd == "cn") {
                        const { queueName, settings } = data;
                        logChannel(controller.channel.id, `Consume queue ${queueName}`);
                        controller.consume(queueName, settings, { cmd, msgID });
                    }
                    else if (cmd === "ack") {
                        const { id, allUpTo = false } = data;
                        logChannel(controller.channel.id, `ACK message ${id}`);
                        controller.ack(allUpTo);
                    }
                    else if (cmd === "nack") {
                        const { allUpTo = false, requeue = true } = data;
                        logChannel(controller.channel.id, `NACK message ${msgID}`);
                        controller.nack(allUpTo, requeue, { cmd, msgID });
                    }
                    else if (cmd === "send-to-queue" || cmd === "sq") {
                        const { queueName, content, settings } = data;
                        logChannel(controller.channel.id, `Send message to queue ${queueName}`);
                        controller.sendToQueue(queueName, content, settings, { cmd, msgID });
                        processQueue();
                    }
                    else if (cmd === "ping") {
                        controller.sendPong();
                    }
                }
                catch (err) {
                    controller.sendError(err);
                    colog.error(err);

                    if (devMode) {
                        throw err;
                    }
                }
            });

            connection.onClose(() => {
                controller.closeChannel();
            });
        });

        let processQueueTimer = 0;

        function processQueue() {
            if (processQueueTimer) {
                clearTimeout(processQueueTimer);
                processQueueTimer = 0;
            }

            manager.processQueues((channel, cmd, message) => {
                try {
                    logChannel(channel.id, "Sending " + cmd + " to channel");
                    let messagePackage = Protocol.prepare(cmd, message);
                    channel.client.send(messagePackage);
                    return Promise.resolve();
                }
                catch (err) {
                    return Promise.reject(err);
                }
            });

            processQueueTimer = setTimeout(() => processQueue(), settings.processQueueInterval || 1000);
        }

        setTimeout(() => processQueue(), settings.processQueueInterval);
    }, err => {
        colog.error(err);
    });
}

module.exports = runServer;