/** @typedef {import("../amqp/channel")} Channel */

const QueueMessage = require("./queue-message");

class Queue {
    constructor() {
        this.name = "";

        /** The queue will survive a broker restart */
        this.durable = true;

        /** Used by only one connection and the queue will be deleted when that connection closes */
        this.exclusive = false;

        /** Queue that has had at least one consumer is deleted when last consumer unsubscribes */
        this.autoDelete = true;

        /** Used by plugins and broker - specific features such as message TTL, queue length limit, etc */
        this.arguments = [];

        this._messages = [];
        this._messagesToDeliver = [];
        this._messagesWaitingForACK = [];

        this._rr = 0;

        this._destroyCounter = 0;

        this.creator = "";
    }

    get countMessages() {
        return this._messages.length;
    }

    get shouldDeleteIfItsEmpty() {
        return this.exclusive || this.autoDelete;
    }

    get isEmpty() {
        return this.countMessages === 0;
    }

    initialize(name, settings) {
        this.name = name;

        Object.keys(settings)
            .filter(key => typeof settings[key] !== "undefined" && typeof this[key] !== "undefined")
            .forEach(key => {
                this[key] = settings[key];
            });
    }

    tryToKill() {
        return ++this._destroyCounter > 10;
    }

    resetLives() {
        this._destroyCounter = 0;
    }

    /**
     * Adds a message to the queue.
     * @param {Message} message Message
     * @param {*} relationship Relationship
     */
    enqueue(message, relationship) {
        if (!relationship) {
            throw new Error("Relation is required");
        }

        message._relationship = relationship;
        this._messages.push(message);
    }

    /**
     * @returns {QueueMessage[]} Messages to deliver
     */
    process(allChannels) {
        this._processPendingMessages(allChannels);
        this._processMessagesToDeliver();

        return this._messagesToDeliver;
    }

    /**
     * @param {Channel[]} allChannels All the channels
     */
    getQueueChannels(allChannels) {
        let channels = allChannels.filter(m => m.isConsumming(this.name));
        return channels;
    }

    /**
     * @param {Channel[]} allChannels All the channels
     */
    hasOneOrMoreChannels(allChannels) {
        let channels = allChannels.some(m => m.isConsumming(this.name));
        return channels;
    }

    _processMessagesToDeliver() {
        let finishedMessages = this._messagesToDeliver.filter(m => m.isInFinishedStatus);

        finishedMessages.forEach(queueMsg => {
            if (queueMsg.isError && queueMsg.canRetry && queueMsg.timeAfterError > 1000) {
                queueMsg.retries++;
                this.enqueue(queueMsg.message, queueMsg.relationship);
            }
        });

        this._messagesToDeliver = this._messagesToDeliver.filter(m => !m.shouldBeDestroyed);
    }

    /**
     * @param {Channel[]} allChannels All the channels
     */
    _processPendingMessages(allChannels) {
        if (this.isEmpty) {
            return;
        }

        let channels = this.getQueueChannels(allChannels);

        if (channels.length === 0) {
            return;
        }

        if (this._rr >= channels.length) {
            this._rr = 0;
        }

        let msg = this._messages.pop();

        let queueMsg = new QueueMessage();
        queueMsg.deliverTo = channels[this._rr].id;
        queueMsg.message = msg;
        queueMsg.relationship = msg._relationship;

        this._rr++;

        this._messagesToDeliver.push(queueMsg);
    }

    serializeToPersist() {
        let data = Object.assign({}, this);
        data._messages = data._messages.filter(m => m.persistent);
        data._messagesToDeliver = data._messagesToDeliver.filter(m => m.persistent);
        data._messagesWaitingForACK = data._messagesWaitingForACK.filter(m => m.persistent);
        return data;
    }

    validate() {
        //  TODO    Ensure queue coherence
    }
}

module.exports = Queue;
