const { expect } = require("chai");

const ProtocolV1 = require("../src/protocols/protocol-v1");

describe("ProtocolV1", () => {
    describe("module", () => {
        it("should work fine", () => {
            expect(ProtocolV1).to.be.ok;
        });
    });

    describe("prepare", () => {
        it("should give a compressed serialized message", () => {
            let expected = "b|dGVzdHx7ImF0dHJpYnV0ZSI6dHJ1ZX0=";
            let result = ProtocolV1.prepare("test", { attribute: true });

            expect(result).to.equals(expected);
        });

        it("should give a compressed serialized message with id", () => {
            let expected = "b|dGVzdDIsMTIzfHsiYXR0cmlidXRlIjoxfQ==";
            let result = ProtocolV1.prepare("test2", { attribute: 1 }, 123);

            expect(result).to.equals(expected);
        });
    });

    describe("parse", () => {
        it("should deserialize a message without Message ID", () => {
            let content = "b|dGVzdHx7ImF0dHJpYnV0ZSI6dHJ1ZX0=";
            let result = ProtocolV1.parse(content);

            expect(result).to.be.ok;
            expect(result.msgID).to.be.undefined;
            expect(result.cmd).to.equals("test");
            expect(result.data).to.be.ok;
            expect(result.data.attribute).to.be.true;
        });

        it("should deserialize a message with Message ID", () => {
            let content = "b|dGVzdDIsMTIzfHsiYXR0cmlidXRlIjoxfQ==";
            let result = ProtocolV1.parse(content);

            expect(result).to.be.ok;
            expect(result.msgID).to.equals("123");
            expect(result.cmd).to.equals("test2");
            expect(result.data).to.be.ok;
            expect(result.data.attribute).to.equals(1);
        });
    });
});