const express = require("express");
import { Application } from "express-ws";
import { ServerListener } from "../network/ServerListener";
import { WebsocketListener } from "../network/WebsocketListener";
import { ServerGameSystem } from "../../model/game/system/ServerGameSystem";
import { ServerTicker } from "../../model/utils/ticker/ServerTicker";
import { uuid } from "../../model/utils/Id";
import { RapierPromise } from "../../model/utils/Rapier";

export class ServerApp {
  private readonly server_listener: ServerListener;
  public readonly websocket_listener: WebsocketListener;
  private readonly app: Application;

  public game!: ServerGameSystem;

  constructor() {
    //network listeners
    this.app = express();
    this.websocket_listener = new WebsocketListener(this, this.app);
    this.server_listener = new ServerListener(this.app);
    this.server_listener.start_server_listener();

    this.init_game();
  }

  private async init_game() {
    await RapierPromise;

    const game = new ServerGameSystem({
      shapelets: [],
      platforms: [
        { body_data: { len: 10, pos: { x: 10, y: 10 } } },
        { body_data: { len: 5, pos: { x: 20, y: 5 } } },
        { body_data: { len: 1, pos: { x: 1, y: 6 } } },
        { body_data: { len: 2, pos: { x: 5, y: 2 } } },
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
