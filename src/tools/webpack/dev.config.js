const config = require("./webpack-config");

const entry = "./src/client/main-dev.tsx";
const mode = "development";

module.exports = config.get_module_export(entry, mode);
