const { expect } = require("chai");

const AmqpManager = require("../src/amqp/amqp-manager");

describe("AmqpManager", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new AmqpManager()).to.be.ok;
        });
    });

    describe("assertQueue", () => {

        let instance = null;
        let channelStub = null;

        beforeEach(() => {
            instance = new AmqpManager();
            channelStub = { attachExchange: () => { } };
        });

        it("should generate a name if queue name is empty", () => {
            expect(() => {
                let name = instance.assertQueue(channelStub, "", {});
                expect(name.indexOf("gen")).to.equals(0);
            }).to.throw(Error);
        });
    });

    describe("assertExchange", () => {

        let instance = null;
        let channelStub = null;

        beforeEach(() => {
            instance = new AmqpManager();
            channelStub = { attachExchange: () => { } };
        });

        it("should fail if name is empty", () => {
            expect(() => {
                instance.assertExchange(channelStub, "", "fanout", {});
            }).to.throw(Error);
        });

        it("should create an exchange if it doesn't exists", () => {
            expect(instance.exchanges["ex1"]).to.be.undefined;

            instance.assertExchange(channelStub, "ex1", "fanout", {});

            expect(instance.exchanges["ex1"]).to.be.ok;
        });

        it("should pass if the same exchange exists", () => {
            instance.assertExchange(channelStub, "ex2", "fanout", {});
            instance.assertExchange(channelStub, "ex2", "fanout", {});

            expect(instance.exchanges["ex2"]).to.be.ok;
        });

        it("should fail if the same name exchange exists with different type", () => {
            instance.assertExchange(channelStub, "ex2", "fanout", {});

            expect(() => {
                instance.assertExchange(channelStub, "ex2", "direct", {});
            }).to.throw(Error);
        });
    });
});
