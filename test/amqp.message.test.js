const { expect } = require("chai");

const Message = require("../src/amqp/message");

describe("Message", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new Message()).to.be.ok;
        });
    });

    describe("serialize", () => {

        let instance;

        beforeEach(() => {
            instance = new Message();
        });

        it("should work fine", () => {
            let data = instance.serialize();
            expect(data).to.be.ok;
        });
    });
});
