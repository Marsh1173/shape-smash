const express = require("express");
import { Application } from "express-ws";
import { ServerListener } from "../network/ServerListener";
import { WebsocketConnectionListener } from "../network/WebsocketConnectionListener";
import { ServerGameSystem } from "../../model/game/system/server/ServerGameSystem";
import { ServerTicker } from "../../model/utils/ticker/ServerTicker";
import { uuid } from "../../model/utils/Id";
import RAPIER from "@dimforge/rapier2d-compat";

export class ServerApp {
  private readonly server_listener: ServerListener;
  public readonly websocket_connection_listener: WebsocketConnectionListener;
  private readonly app: Application;

  public game!: ServerGameSystem;

  constructor() {
    //network listeners
    this.app = express();
    this.websocket_connection_listener = new WebsocketConnectionListener(this, this.app);
    this.server_listener = new ServerListener(this.app);
    this.server_listener.start_server_listener();
    this.websocket_connection_listener.start_websocket_listener();

    this.init_game();
  }

  private async init_game() {
    await RAPIER.init();

    const game = new ServerGameSystem({
      obj_data: [
        { type: "PlatformData", id: uuid(), positional_data: { len: 14, pos: { x: 10, y: -5 } } },
        { type: "PlatformData", id: uuid(), positional_data: { len: 6, pos: { x: 18, y: -6 } } },
        { type: "PlatformData", id: uuid(), positional_data: { len: 12, pos: { x: 14, y: -15 } } },
        { type: "PlatformData", id: uuid(), positional_data: { len: 5, pos: { x: 20, y: -10 } } },
        { type: "PlatformData", id: uuid(), positional_data: { len: 6, pos: { x: -1, y: -9 } } },
        { type: "PlatformData", id: uuid(), positional_data: { len: 1, pos: { x: 5, y: -13 } } },
        { type: "PortalData", id: uuid(), positional_data: { pos: { x: -2, y: -9.5 } } },
      ],
    });

    ServerTicker.add({
      id: uuid(),
      update(elapsed_seconds) {
        game.update(elapsed_seconds);
      },
    });

    this.game = game;
  }
}
