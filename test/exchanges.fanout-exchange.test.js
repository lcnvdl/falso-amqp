const { expect } = require("chai");

const FanoutExchange = require("../src/exchanges/fanout.exchange");

describe("FanoutExchange", () => {
    describe("constructor", () => {
        it("should work fine", () => {
            expect(new FanoutExchange()).to.be.ok;
        });
    });
});