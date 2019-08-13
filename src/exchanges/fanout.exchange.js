const Exchange = require("./exchange");

class FanoutExchange extends Exchange {
    get type() {
        return "fanout";
    }

    publish(message, _routingKey, relationships) {
        let deliveredQueues = [];

        relationships.forEach(relationship => {
            const { queueName, queue } = relationship;

            if (deliveredQueues.indexOf(queueName) === -1) {
                queue.enqueue(message);
                deliveredQueues.push(queueName);
            }
        });
    }
}

module.exports = FanoutExchange;