const config = require("./webpack-config");

const entry = "./src/client/main.tsx";
const mode = "development";

module.exports = config.get_module_export(entry, mode);
