import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { ClientTicker } from "../model/utils/ticker/ClientTicker";
import { uuid } from "../model/utils/Id";
import "./main.less";
import { ImageAssetHandler } from "../model/game/display/assets/Assets";
import { ServerTalker } from "./network/ServerTalker";
import { ClientGameData, ClientGameSystem } from "../model/game/system/client/ClientGameSystem";
import RAPIER from "@dimforge/rapier2d-compat";

export function run() {
  class MainDiv extends Component<{}, {}> {
    private readonly canvas_ref = React.createRef<HTMLCanvasElement>();
    private readonly server_talker: ServerTalker;

    private canvas: HTMLCanvasElement | undefined = undefined;
    private game_data: ClientGameData | undefined = undefined;

    constructor(props: any) {
      super(props);

      this.server_talker = new ServerTalker();
      this.server_talker.set_listener({
        receive_message: (msg) => {
          if (msg.type === "GameDataMessage") {
            this.game_data = msg.data;
            this.server_talker.clear_listener();
            this.attempt_start_game();
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
        const game_data = this.game_data;
        const canvas = this.canvas;

        const game = new ClientGameSystem(game_data, canvas, this.server_talker);

        ClientTicker.add({
          id: uuid(),
          update: (elapsed_seconds: number) => game.update(Math.min(elapsed_seconds, 1)),
        });
      }
    }
  }

  const domContainer = document.querySelector("#reactDom")!;
  const root = createRoot(domContainer);
  Promise.all([RAPIER.init(), ImageAssetHandler.load_all_images()]).then(() => {
    root.render(<MainDiv></MainDiv>);
  });
}
