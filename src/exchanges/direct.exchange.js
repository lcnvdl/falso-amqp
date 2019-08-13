const Exchange = require("./exchange");

class DirectExchange extends Exchange {
    get type() {
        return "direct";
    }

    publish(message, messageRoutingKey, relationships) {
        let deliveredQueues = [];

        relationships.forEach(relationship => {
            const { queueName, routingKey, queue } = relationship;

            if (messageRoutingKey === routingKey && deliveredQueues.indexOf(queueName) === -1) {
                queue.enqueue(message);
                deliveredQueues.push(queueName);
            }
        });
    }
}

module.exports = DirectExchange;