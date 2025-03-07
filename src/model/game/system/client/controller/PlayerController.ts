import { ClientShapelet } from "../../../objects/objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "../ClientGameSystem";
import { ShapeletAction } from "../../../objects/objects/shapelet/ShapeletController";

export class PlayerController {
  constructor(protected readonly shapelet: ClientShapelet, protected readonly game_system: ClientGameSystem) {}

  public route_input(action: ShapeletAction, active: boolean) {
    this.broadcast_move(action, active);
  }

  protected broadcast_move(action: ShapeletAction, active: boolean) {
    this.game_system.server_talker.send({
      type: "ClientGameMessage",
      msg: {
        type: "PlayerMoveMessage",
        active,
        action,
        pos: this.shapelet.positional_component.pos,
        vel: this.shapelet.positional_component.vel,
      },
    });
  }
}
