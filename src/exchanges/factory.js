module.exports = {
    instantiate(name, type, settings) {
        const Class = require("./" + type + ".exchange");
        if (!Class) {
            throw new Error("Invalid exchange");
        }

        const instance = new Class();
        instance.initialize(name, settings);
        return instance;
    }
}