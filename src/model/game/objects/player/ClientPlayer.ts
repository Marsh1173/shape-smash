import { ShapeletData } from "../shapelet/Shapelet";
import { Input } from "../../display/Input";
import { ClientShapelet } from "../shapelet/ClientShapelet";
import { ClientGameSystem } from "../../system/ClientGameSystem";
import { HasId, Id } from "../../../utils/Id";
import { ShapeletAction } from "../shapelet/ShapeletController";

export interface ClientPlayerData {
  shapelet_data: ShapeletData;
}

export class ClientPlayer extends HasId {
  public readonly id: Id;

  constructor(
    protected readonly shapelet: ClientShapelet,
    data: ClientPlayerData,
    protected readonly game_system: ClientGameSystem
  ) {
    super();
    this.id = data.shapelet_data.id;

    Input.set_listener({
      on_start_up: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveUp, true);
        this.broadcast_move(ShapeletAction.MoveUp, true);
      },
      on_end_up: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveUp, false);
        this.broadcast_move(ShapeletAction.MoveUp, false);
      },
      on_start_left: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveLeft, true);
        this.broadcast_move(ShapeletAction.MoveLeft, true);
      },
      on_end_left: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveLeft, false);
        this.broadcast_move(ShapeletAction.MoveLeft, false);
      },
      on_start_right: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveRight, true);
        this.broadcast_move(ShapeletAction.MoveRight, true);
      },
      on_end_right: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveRight, false);
        this.broadcast_move(ShapeletAction.MoveRight, false);
      },
    });
  }

  public update(elapsed_seconds: number) {
    this.shapelet.update(elapsed_seconds);
  }

  public destroy() {
    Input.clear_listener();
    this.shapelet.destroy();
  }

  public get_shapelet(): ClientShapelet {
    return this.shapelet;
  }

  protected broadcast_move(action: ShapeletAction, active: boolean) {
    this.game_system.server_talker.send({
      type: "ClientGameMessage",
      msg: {
        type: "PlayerMoveMessage",
        active,
        action,
        pos: this.shapelet.body.pos,
        vel: this.shapelet.body.velocity,
      },
    });
  }
}
