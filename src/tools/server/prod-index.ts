// import { start_server } from "./index";
// const start_server = require("./index");
// const ServerConfig = require("./server-config");

import { ServerApp } from "../../server/app/app";
import { ServerConfig } from "./server-config";

ServerConfig.set("production");

try {
  new ServerApp();
} catch (err) {
  console.error("Could not initialize server app.");
  console.error(err);
  process.exitCode = 1;
}