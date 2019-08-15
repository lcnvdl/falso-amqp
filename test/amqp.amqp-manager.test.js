const { expect } = require("chai");

const AmqpManager = require("../src/amqp/amqp-manager");

describe("AmqpManager", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new AmqpManager()).to.be.ok;
        });
    });

    describe("assertExchange", () => {

        let instance = null;

        beforeEach(() => {
            instance = new AmqpManager();
        });

        it("should fail if name is empty", () => {
            expect(() => {
                instance.assertExchange({}, "", "fanout", {});
            }).to.throw(Error);
        });

        it("should create an exchange if it doesn't exists", () => {
            expect(instance.exchanges["ex1"]).to.be.undefined;

            const channel = { attachExchange: () => { } };
            instance.assertExchange(channel, "ex1", "fanout", {});

            expect(instance.exchanges["ex1"]).to.be.ok;
        });

        it("should pass if the same exchange exists", () => {
            const channel = { attachExchange: () => { } };
            instance.assertExchange(channel, "ex2", "fanout", {});
            instance.assertExchange(channel, "ex2", "fanout", {});

            expect(instance.exchanges["ex2"]).to.be.ok;
        });

        it("should fail if the same name exchange exists with different type", () => {
            const channel = { attachExchange: () => { } };
            instance.assertExchange(channel, "ex2", "fanout", {});

            expect(() => {
                instance.assertExchange(channel, "ex2", "direct", {});
            }).to.throw(Error);
        });
    });

});
