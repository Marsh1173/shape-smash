import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { ClientTicker } from "../model/utils/ticker/ClientTicker";
import { uuid } from "../model/utils/Id";
import "./main.less";
import { Input } from "../model/game/display/Input";
import { ImageAssetHandler } from "../model/game/display/Assets";
import { ServerTalker } from "./network/ServerTalker";
import { ClientGameData, ClientGameSystem } from "../model/game/system/ClientGameSystem";
import RAPIER from "@dimforge/rapier2d-compat";

export function run() {
  const server_talker = new ServerTalker();
  const load_all_images_promise = ImageAssetHandler.load_all_images();

  class MainDiv extends Component<{}, {}> {
    private canvas_ref = React.createRef<HTMLCanvasElement>();

    private canvas: HTMLCanvasElement | undefined = undefined;
    private game_data: ClientGameData | undefined = undefined;

    constructor(props: any) {
      super(props);

      server_talker.set_listener({
        receive_message: (msg) => {
          if (msg.type === "GameDataMessage") {
            this.game_data = msg.data;
            this.attempt_start_game();
            server_talker.clear_listener();
          }
        },
      });
    }

    render() {
      return <canvas ref={this.canvas_ref}></canvas>;
    }

    async componentDidMount() {
      this.canvas = this.canvas_ref.current!;
      this.attempt_start_game();
    }

    protected async attempt_start_game() {
      if (this.canvas && this.game_data) {
        await Promise.all([RAPIER.init(), load_all_images_promise]);

        const game_data = this.game_data;
        const canvas = this.canvas;

        const game = new ClientGameSystem(game_data, canvas, server_talker);

        ClientTicker.add({
          id: uuid(),
          update: (elapsed_seconds: number) => game.update(Math.min(elapsed_seconds, 1)),
        });
      }
    }
  }

  Input.init();
  const domContainer = document.querySelector("#reactDom")!;
  const root = createRoot(domContainer);
  root.render(<MainDiv></MainDiv>);
}
