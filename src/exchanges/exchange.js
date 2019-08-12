class Exchange {
    constructor() {
        this.name = "";

        /** Exchange survive broker restart */
        this.durability = true;
        
        /** Exchange is deleted when last queue is unbound from it */
        this.autoDelete = false;

        /** Optional, used by plugins and broker - specific features */
        this.arguments = [];
    }

    publish(message, specificQueue) {
        throw new Error("Abstract method");
    }
}

module.exports = Exchange;