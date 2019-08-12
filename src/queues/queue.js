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
        this.Arguments = [];
    }
}

module.exports = Queue;
