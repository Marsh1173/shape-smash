import { ServerHealthComponentMessage } from "../server/ServerHealthComponentSchema";
import { ClientHealthComponent } from "./ClientHealthComponent";

export class ClientHealthComponentSyncher {
  constructor(protected readonly health_component: ClientHealthComponent) {}

  public route_msg(msg: ServerHealthComponentMessage) {
    if (msg.msg.type === "ServerHealthComponentUpdateCurrentHealthMessage") {
      this.health_component.current_health.set_value(msg.msg.new_value);
    } else if (msg.msg.type === "ServerHealthComponentUpdateMaxHealthMessage") {
      this.health_component.max_health.set_value(msg.msg.new_value);
    } else if (msg.msg.type === "ServerHealthComponentDieMessage") {
      this.health_component.die();
    } else {
      throw new Error("Route not implemented yet");
    }
  }
}
