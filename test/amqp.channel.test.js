const { expect } = require("chai");

const Channel = require("../src/amqp/channel");
const DirectExchange = require("../src/exchanges/direct.exchange");
const Queue = require("../src/queues/queue");

describe("Channel", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new Channel()).to.be.ok;
        });
    });

    describe("hasExchange", () => {
        let instance = null;
        let exchange = null;
        let queue = null;

        beforeEach(() => {
            instance = new Channel();
            queue = new Queue();
            queue.initialize("q1", {});
            exchange = new DirectExchange();
            exchange.initialize("ex1", {});
        });

        it("should be false if it doesn't have attached exchanges", () => {
            expect(instance.hasExchange("ex1")).to.be.false;
        });

        it("should be true if it has the exchange attached", () => {
            instance.attachExchange(exchange);
            instance.attachQueue(queue);
            instance.bindQueue(queue.name, exchange.name, "");
            expect(instance.hasExchange("ex1")).to.be.true;
        });

        it("should be true if it hasn't the exchange attached", () => {
            instance.attachExchange(exchange);
            instance.attachQueue(queue);
            instance.bindQueue(queue.name, exchange.name, "");
            expect(instance.hasExchange("ex2")).to.be.false;
        });
    });
});
