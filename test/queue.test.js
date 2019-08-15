const { expect } = require("chai");

const Queue = require("../src/queues/queue");

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
});
