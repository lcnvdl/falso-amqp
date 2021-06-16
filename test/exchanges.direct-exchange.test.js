const { expect } = require("chai");

const DirectExchange = require("../src/exchanges/direct.exchange");

describe("DirectExchange", () => {
    describe("instance", () => {
        it("type should be fine", () => {
            let instance = new DirectExchange();
            expect(instance.type).to.equals("direct");
        });
    });
});