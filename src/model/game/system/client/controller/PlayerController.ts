import { ClientShapelet } from "../../../objects/objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "../ClientGameSystem";
import { ShapeletAction } from "../../../objects/objects/shapelet/ShapeletController";

export class PlayerController {
  constructor(
    protected readonly shapelet: ClientShapelet,
    protected readonly game_system: ClientGameSystem
  ) {}

  public route_input(action: ShapeletAction, active: boolean) {
    if (action === ShapeletAction.Jump) {
      this.shapelet.controller.on_input(ShapeletAction.Jump, active);
      this.broadcast_move(ShapeletAction.Jump, active);
    } else if (action === ShapeletAction.MoveRight) {
      this.shapelet.controller.on_input(ShapeletAction.MoveRight, active);
      this.broadcast_move(ShapeletAction.MoveRight, active);
    } else if (action === ShapeletAction.MoveLeft) {
      this.shapelet.controller.on_input(ShapeletAction.MoveLeft, active);
      this.broadcast_move(ShapeletAction.MoveLeft, active);
    } else if (action === ShapeletAction.MainAction) {
      this.broadcast_move(ShapeletAction.MainAction, active);
    }
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
