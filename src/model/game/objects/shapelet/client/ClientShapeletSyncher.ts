import { ClientHealthComponentSyncher } from "../../components/health/client/ClientHealthComponentSyncher";
import { ClientShapelet } from "./ClientShapelet";
import { ServerShapeletMessage } from "../server/ServerShapeletSchema";

export class ClientShapeletSyncher {
  protected readonly health_syncher: ClientHealthComponentSyncher;

  constructor(protected readonly shapelet: ClientShapelet) {
    this.health_syncher = new ClientHealthComponentSyncher(shapelet.health_component);
  }

  public route_msg(msg: ServerShapeletMessage) {
    if (msg.msg.type === "ServerHealthComponentMessage") {
      this.health_syncher.route_msg(msg.msg);
    } else if (msg.msg.type === "ServerShapeletMoveMessage") {
      this.shapelet.controller.on_input(msg.msg.action, msg.msg.active);
      this.shapelet.body.set_pos_and_vel(msg.msg.pos, msg.msg.vel);
    } else {
      throw new Error("Route not implemented yet");
    }
  }
}
