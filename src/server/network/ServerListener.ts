const express = require("express");
import { Application } from "express-ws";
import * as path from "path";

export interface IServerListener {
  start_server_listener(): void;
}

export class ServerListener implements IServerListener {
  constructor(private readonly app: Application) {}

  public start_server_listener() {
    this.app.use(express.static(path.join(__dirname, "../../../public")));
    this.app.get("/bundle.js", async (request, response) => {
      response.sendFile(path.join(__dirname, "../../../dist/client/bundle.js"));
    });
  }
}
