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

    serializeToPersist() {
        let data = Object.assign({}, this);
        data._messages = data._messages.filter(m => m.persistent);
        return data;
    }
}

module.exports = Queue;
