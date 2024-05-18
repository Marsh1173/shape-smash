import { ClientShapelet } from "./ClientShapelet";
import { ServerShapeletMessage } from "../server/ServerShapeletSchema";
import { ClientGameSystem } from "../../../../system/client/ClientGameSystem";

export class ClientShapeletSyncher {
  constructor(protected readonly shapelet: ClientShapelet, protected readonly game_system: ClientGameSystem) {}

  public route_msg(msg: ServerShapeletMessage) {
    if (msg.msg.type === "ServerShapeletActionMessage") {
      if (
        this.game_system.player_state.value.type !== "ClientGamePlayerAliveState" ||
        this.shapelet.id !== this.game_system.player_state.value.shapelet.id
      ) {
        this.shapelet.controller.on_input(msg.msg.action, msg.msg.active);
        this.shapelet.positional_component.set_pos_and_vel(msg.msg.pos, msg.msg.vel);
      }
    } else {
      throw new Error("Route not implemented yet");
    }
  }
}
