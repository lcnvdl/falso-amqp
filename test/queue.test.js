const { expect } = require("chai");
const Message = require("../src/amqp/message");
const Queue = require("../src/queues/queue");
const Channel = require("../src/amqp/channel");
const Exchange = require("../src/exchanges/direct.exchange");

describe("Queue", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new Queue()).to.be.ok;
        });
    });

    describe("countMessages", () => {
        let queue = null;

        beforeEach(() => {
            queue = new Queue();
        });

        it("should be zero if its empty", () => {
            expect(queue.countMessages).to.equal(0);
        });
    });

    describe("enqueue", () => {
        let queue = null;
        let message = null;

        beforeEach(() => {
            queue = new Queue();
            message = new Message();
        });

        it("should work fine", () => {
            expect(queue.countMessages).to.equal(0);
            queue.enqueue(message, { noAck: true });
            expect(queue.countMessages).to.equal(1);
            expect(queue._messages[0]._relationship).to.be.ok;
        });
    });

    describe("serialize", () => {
        let queue = null;

        beforeEach(() => {
            queue = new Queue();
        });

        it("should work fine", () => {
            const value = queue.serializeToPersist();
            expect(value).to.be.ok;
        });
    });

    describe("process", () => {
        /** @type {Queue} */
        let queue = null;
        let message = null;
        let channel = null;
        let relation = { noAck: true };
        let exchange = null;

        beforeEach(() => {
            exchange = new Exchange();
            exchange.name = "E1";

            queue = new Queue();
            queue.name = "Q1";
            
            message = new Message();
            message2 = new Message();
            
            channel = new Channel({});

            channel.attachExchange(exchange);
            channel.attachQueue(queue);

            channel.bindQueue("Q1", "E1", "");

            channel.consume("Q1", {});
        });

        it("empty queue should return an empty array", () => {
            let result = queue.process([channel]);
            expect(result).to.be.ok;
            expect(result.length).to.equals(0);
        });

        it("a queue with two messages should return the first one", () => {
            queue.enqueue(message, relation);
            queue.enqueue(message2, relation);

            let result = queue.process([channel]);
            expect(result).to.be.ok;
            expect(result.length).to.equals(1);
            expect(result[0].isPending).to.be.true;
        });
    });
});
