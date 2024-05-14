import { Id } from "../../../../../utils/Id";
import { ClientGameSystem } from "../../../../system/client/ClientGameSystem";
import { HealthComponent, HealthComponentData } from "../HealthComponent";
import { ServerHealthComponentMessage } from "../server/ServerHealthComponentSchema";

export class ClientHealthComponent extends HealthComponent {
  constructor(
    max_health: number,
    data: HealthComponentData,
    game_system: ClientGameSystem,
    object_id: Id
  ) {
    super(max_health, data.current_health ?? max_health, game_system, object_id);
  }

  public heal(amount: number, new_health: number, old_health: number) {
    this.current_health.set_value(new_health);
    this.heal_observable.on_take_heal({
      amount: amount,
      old_health: old_health,
      new_health: new_health,
    });
  }

  public damage(amount: number, new_health: number, old_health: number) {
    this.current_health.set_value(new_health);
    this.damage_observable.on_take_damage({
      amount: amount,
      old_health: old_health,
      new_health: new_health,
    });
  }

  public die() {
    this.death_observable.on_die(undefined);
  }

  public route_msg(msg: ServerHealthComponentMessage) {
    if (msg.msg.type === "ServerHealthComponentTakeDamageMessage") {
      this.damage(msg.msg.amount, msg.msg.new_health, msg.msg.old_health);
    } else if (msg.msg.type === "ServerHealthComponentTakeHealMessage") {
      this.heal(msg.msg.amount, msg.msg.new_health, msg.msg.old_health);
    } else if (msg.msg.type === "ServerHealthComponentUpdateMaxHealthMessage") {
      this.max_health.set_value(msg.msg.new_value);
    } else if (msg.msg.type === "ServerHealthComponentDieMessage") {
      this.die();
    } else {
      throw new Error("Route not implemented yet");
    }
  }
}
