import { ServerHealthComponentMessage } from "../server/ServerHealthComponentSchema";
import { ClientHealthComponent } from "./ClientHealthComponent";

export class ClientHealthComponentSyncher {
  constructor(protected readonly health_component: ClientHealthComponent) {}

  public route_msg(msg: ServerHealthComponentMessage) {
    if (msg.msg.type === "ServerHealthComponentTakeDamageMessage") {
      this.health_component.damage(msg.msg.amount, msg.msg.new_health, msg.msg.old_health);
    } else if (msg.msg.type === "ServerHealthComponentTakeHealMessage") {
      this.health_component.heal(msg.msg.amount, msg.msg.new_health, msg.msg.old_health);
    } else if (msg.msg.type === "ServerHealthComponentUpdateMaxHealthMessage") {
      this.health_component.max_health.set_value(msg.msg.new_value);
    } else if (msg.msg.type === "ServerHealthComponentDieMessage") {
      this.health_component.die();
    } else {
      throw new Error("Route not implemented yet");
    }
  }
}
