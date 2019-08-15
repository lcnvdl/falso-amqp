const { expect } = require("chai");

const Message = require("../src/amqp/message");

describe("Message", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new Message()).to.be.ok;
        });
    });
});
