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

        this._rr = 0;

        this.creator = "";
    }

    get countMessages() {
        return this._messages.length;
    }

    initialize(name, settings) {
        this.name = name;

        Object.keys(settings)
            .filter(key => typeof settings[key] !== "undefined" && typeof this[key] !== "undefined")
            .forEach(key => {
                this[key] = settings[key];
            });
    }

    /**
     * Adds a message to the queue.
     * @param {Message} message Message
     */
    enqueue(message) {
        this._messages.push(message);
    }

    process(allChannels) {
        this._processPendingMessages(allChannels);
        this._processMessagesToDeliver();

        return this._messagesToDeliver;
    }

    _processMessagesToDeliver() {

        let finishedMessages = this._messagesToDeliver.filter(m => m.isInFinishedStatus);

        finishedMessages.forEach(queueMsg => {
            if (queueMsg.isError && queueMsg.canRetry && queueMsg.timeAfterError > 1000) {
                queueMsg.retries++;
                this.enqueue(queueMsg.message);
            }
        });

        this._messagesToDeliver = this._messagesToDeliver.filter(m => !m.shouldBeDestroyed);
    }

    _processPendingMessages(allChannels) {
        if (this._messages.length === 0) {
            return;
        }

        let channels = allChannels
            .filter(m => m.isConsumming(this.name));

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

        this._rr++;

        this._messagesToDeliver.push(queueMsg);
    }

    serializeToPersist() {
        let data = Object.assign({}, this);
        data._messages = data._messages.filter(m => m.persistent);
        return data;
    }

    validate() {
        //  TODO    Ensure queue coherence
    }
}

module.exports = Queue;
