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

    get type() {
        throw new Error("Abstract property");
    }

    /*get isDefault() {
        return this.name === "" && this.type === "direct";
    }*/

    initialize(name, settings) {
        this.name = name;

        settings = settings || {};

        if (typeof settings.durability !== 'undefined') {
            this.durability = settings.durability;
        }

        if (typeof settings.arguments !== 'undefined') {
            this.arguments = settings.arguments;
        }

        if (typeof settings.autoDelete !== 'undefined') {
            this.autoDelete = settings.autoDelete;
        }
    }

    publish(message, routingKey, relationships) {
        throw new Error("Abstract method");
    }

    validate() {
        //  TODO    Asegurar coherencia de exchange
    }
}

module.exports = Exchange;