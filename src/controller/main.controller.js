/** @typedef {import("../amqp/channel")} Channel */
/** @typedef {import("../amqp/amqp-manager")} Manager */

class MainController {
    /**
     * @param {Object} obj An object.
     * @param {Manager} obj.manager Manager
     * @param {*} obj.connection Connection
     * @param {*} obj.Protocol Protocol
     */
    constructor({ manager, connection, Protocol }) {
        this.connection = connection;
        this.manager = manager;
        this.Protocol = Protocol;
        /** @type {Channel} */
        this.channel = null; 
    }

    get hasChannel() {
        return !!this.channel;
    }

    newChannel({ cmd, msgID }) {
        this.channel = this.channel || this.manager.createChannel(this.connection);
        this.success(cmd, msgID);
    }

    requestChannel() {
        this.send("need-channel");
    }

    assertExchange(name, type, settings, { cmd, msgID }) {
        this.manager.assertExchange(this.channel, name, type, settings);
        this.success(cmd, msgID);
    }

    assertQueue(name, settings, { cmd, msgID }) {
        let finalName = this.manager.assertQueue(this.channel, name, settings);
        let status = this.manager.getQueueStatus(finalName);
        this.send(cmd, status, msgID);
    }

    publish(exchangeName, routingKey, content, settings, { cmd, msgID }) {
        this.manager.publish(exchangeName, routingKey, content, settings);
        this.success(cmd, msgID);
    }

    consume(queueName, settings, { cmd, msgID }) {
        this.channel.consume(queueName, settings || {});
        this.success(cmd, msgID);
    }

    ack(id, allUpTo) {
        //  TODO    Implement ACK
        this.sendWarning("Manual ACK: Feature not implemented yet");
    }

    nack(id, allUpTo, requeue) {
        //  TODO    Implement ACK
        this.sendWarning("Manual NACK: Feature not implemented yet");
    }

    sendToQueue(queueName, content, settings, { cmd, msgID }) {
        this.manager.sendToQueue(this.channel, queueName, content, settings);
        this.success(cmd, msgID);
    }

    sendPong() {
        this.send("pong");
    }

    sendWarning(message) {
        this.send("warning", { message });
    }

    sendError(err) {
        let error;

        if (typeof err === "string") {
            error = {
                message: err,
                object: {},
                stack: ""
            };
        }
        else {
            error = {
                message: "" + err,
                object: err,
                stack: err.stack
            };
        }

        this.send("error", error);
    }

    bindQueue(queueName, exchangeName, routingKey, { cmd, msgID }) {
        this.channel.bindQueue(queueName, exchangeName, routingKey);
        this.success(cmd, msgID);
    }

    prefetch(number, { cmd, msgID }) {
        this.channel.prefetch = number;
        this.send(cmd, {}, msgID);
    }

    success(cmd, msgID) {
        this.send(cmd, {}, msgID);
    }

    send(cmd, data, msgID) {
        let message = this.Protocol.prepare(cmd, data || {}, msgID);
        this.connection.send(message);
    }

    closeChannel() {
        if (this.hasChannel) {
            this.manager.closeChannel(this.channel.id);
        }
    }
}

module.exports = MainController;
