const Exchange = require("../../src/exchanges/exchange");

class ExchangeStub extends Exchange {
    constructor() {
        super();
        this.calls = {
            validate: {
                counter: 0,
                mock: false,
            }
        };
    }

    get type() {
        return "stub";
    }

    validate(_type, _settings) {
        if (!this.calls.mock) {
            super.validate(_type, _settings);
        }
        this.calls.validate.counter++;
    }
}

module.exports = ExchangeStub;