const { expect } = require("chai");

const AmqpManager = require("../src/amqp/amqp-manager");

describe("AmqpManager", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new AmqpManager()).to.be.ok;
        });
    });

    describe("assertQueue", () => {

        /** @type {AmqpManager} */
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

        it("should use the specified name if it is not empty", () => {
            expect(() => {
                let name = instance.assertQueue(channelStub, "Q3", {});
                expect(name).to.equals("Q3");
            }).to.throw(Error);
        });
    });

    describe("getQueueStatus", () => {

        /** @type {AmqpManager} */
        let instance = null;

        beforeEach(() => {
            instance = new AmqpManager();
        });

        it("should return null if queue doesn't exists", () => {
            let result = instance.getQueueStatus("unexisting");
            expect(result).to.be.null;
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

    describe("process", () => {

        /** @type {AmqpManager} */
        let instance = null;

        beforeEach(() => {
            instance = new AmqpManager();
        });

        describe("without channels", () => {
            it("process should work fine", () => {
                instance.processQueues(() => { });
            });
        });

        describe("with channels", () => {

            let socketClosed = false;
            let socketStub = null;
            let ch = null;

            beforeEach(() => {
                ch = instance.createChannel(socketStub);
                instance.assertQueue(ch, "Q1", { autoDelete: true });
                socketStub = {
                    close: () => socketClosed = true
                };
            });

            it("process should delete auto-delete empty queues after 10 tries", () => {
                let i = 0;

                while (i++ < 10 + 1) {
                    let q = instance.allQueues[0];
                    expect(q, "The queue must exists").to.be.ok;
                    instance.processQueues(() => {});
                }

                expect(instance.allQueues.length).to.equal(0, "The queue still existing");
            });

            function sendMessageToChannel(channel, cmd, data) {
            }
        });
    });

    describe("closeChannel", () => {

        /** @type {AmqpManager} */
        let instance = null;
        let socketClosed = false;
        let socketStub = {
            close: () => socketClosed = true
        };

        beforeEach(() => {
            instance = new AmqpManager();
            socketClosed = false;
        });

        it("closing existing channel should work fine", () => {
            let channel = instance.createChannel(socketStub);
            expect(channel).to.be.ok;
            expect(instance.allChannels.some(m => m.id === channel.id)).to.be.true;
            expect(channel.isClosed).to.be.false;
            expect(socketClosed).to.be.false;

            instance.closeChannel(channel.id);
            expect(instance.allChannels.some(m => m.id === channel.id)).to.be.false;
            expect(channel.isClosed, "Channel must be finished").to.be.true;
            expect(socketClosed).to.be.true;
        });

        it("closing unexisting channel should work fine", () => {
            let channel = instance.createChannel(socketStub);
            expect(channel).to.be.ok;
            expect(instance.allChannels.some(m => m.id === channel.id)).to.be.true;
            expect(channel.isClosed).to.be.false;
            expect(socketClosed).to.be.false;

            instance.closeChannel(channel.id+"1");
            expect(instance.allChannels.some(m => m.id === channel.id)).to.be.true;
            expect(channel.isClosed, "Channel must NOT be finished").to.be.false;
            expect(socketClosed).to.be.false;
        });
    });
});
