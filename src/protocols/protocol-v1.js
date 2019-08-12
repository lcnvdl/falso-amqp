const JsonHelper = require("../helpers/json.helper");

class ProtocolV1 {
    static parse(msg) {
        if (msg[0] === "b" && msg[1] === "|") {
            msg = JsonHelper.stringFromB64(msg.substr(2)).trim();
        }

        cmd = msg.substr(0, msg.indexOf("|"));
        msg = msg.substr(msg.indexOf("|") + 1);

        msgID = cmd.split(",")[1];
        cmd = cmd.split(",")[0];

        if (msg[0] === "{") {
            return {
                cmd,
                msgID,
                data: JSON.parse(msg)
            };
        }

        throw new Error("Invalid package");
    }

    static prepare(cmd, obj, replyTo) {
        if (replyTo) {
            cmd = cmd + "," + replyTo;
        }
        msg = cmd + "|" + JSON.stringify(obj);
        msg = "b|" + JsonHelper.toB64(msg);
        return msg;
    }
}

module.exports = ProtocolV1;