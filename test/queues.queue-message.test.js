const { expect } = require("chai");

const QueueMessage = require("../src/queues/queue-message");

describe("QueueMessage", () => {
    let instance = null;

    beforeEach(() => {
        instance = new QueueMessage();
    });

    describe("send", () => {
        it("should work fine", () => {
            expect(instance.isPending).to.be.true;
            expect(instance.isInFinishedStatus).to.be.false;
            expect(instance.isError).to.be.false;
            instance.send();
            expect(instance.isPending).to.be.false;
            expect(instance.isInFinishedStatus).to.be.false;
            expect(instance.isError).to.be.false;
        });
    });

    describe("needsAck", () => {
        it("should be false by default", () => {
            expect(instance.needsAck).to.be.false;
        });
    });

    describe("setError", () => {
        it("should work fine", () => {
            expect(instance.isPending).to.be.true;
            expect(instance.isInFinishedStatus).to.be.false;
            expect(instance.isError).to.be.false;
            instance.setError();
            expect(instance.isPending).to.be.false;
            expect(instance.isError).to.be.true;
            expect(instance.isInFinishedStatus).to.be.true;
        });
    });
});
