const { expect } = require("chai");

const FanoutExchange = require("../src/exchanges/fanout.exchange");

describe("FanoutExchange", () => {
    describe("instance", () => {
        it("type should be fine", () => {
            let instance = new FanoutExchange();
            expect(instance.type).to.equals("fanout");
        });
    });
});