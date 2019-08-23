const colog = require("colog");

module.exports = {
    logo(version) {
        colog.log(" ");
        colog.log(colog.bgBlue("                    "));
        colog.log(colog.colorBlue(
            colog.bgWhite("    FALSO") +
            colog.bgYellow("  ") +
            colog.bgWhite("AMQP     ")));
        colog.log(colog.colorCyan(colog.bgBlue(" lucianorasente.com ")));
        colog.log(" ");
        colog.log(colog.magenta("Version " + version));
        colog.log(" ");
    },

    logChannel(id, message) {
        colog.log(colog.colorGreen(id) + ": " + colog.colorWhite(message));
    }
};